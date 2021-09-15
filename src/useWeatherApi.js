import { useState, useEffect, useCallback } from "react";
// 授權碼 CWB-D56A3D9F-F75F-4C2C-A97D-3A6A26998D2D
const authorizationKey = "CWB-D56A3D9F-F75F-4C2C-A97D-3A6A26998D2D";

const fetchCurrentWeather = (locationName) => {
  // 加上 return 直接把 fetch API 回傳的 Promise 回傳出去
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP", "HUMD"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );
      // 把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        humid: weatherElements.HUMD
      };
    });
};
const fetchWeatherForecast = (cityName) => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
  )
    .then((response) => response.json())
    .then((data) => {
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      // 把取得的資料內容回傳出去，而不是在這裡 setWeatherElement
      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName
      };
    });
};

const useWeatherApi = (currentLocation) => {
  const { locationName, cityName } = currentLocation;
  // 使用 useState
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    humid: 0,
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true
  });

  // 使用 useCallback 並將回傳的函式取名為 fetchData
  const fetchData = useCallback(() => {
    // 把原本的 fetchData 改名為 fetchingData 放到 useCallback 的函式內
    const fetchingData = async () => {
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(locationName),
        fetchWeatherForecast(cityName)
      ]);

      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false
      });
    };

    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true
    }));
    // 記得要呼叫 fetchingData 這個方法
    fetchingData();
    // 將 locationName 和 cityName 帶入 useCallback 的 dependencies 中
  }, [locationName, cityName]);

  // 使用 useEffect Hook
  useEffect(() => {
    fetchData();
    // S把透過 useCallback 回傳的函式放到 useEffect 的 dependencies 中
  }, [fetchData]);

  // 把要給其他 React 組件使用的資料或方法回傳出去
  return [weatherElement, fetchData];
};

export default useWeatherApi;
