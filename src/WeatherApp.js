import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled"; // 載入 emotion 的 styled 套件
import sunriseAndSunsetData from "./sunrise-sunset.json"; // 匯入日出日落資料
import WeatherCard from "./WeatherCard"; // 載入 WeatherCard 組件
import useWeatherApi from "./useWeatherApi"; // 載入 useWeatherApi Hook
import WeatherSetting from "./WeatherSetting"; // 匯入 WeatherSetting

// `emotion-theming` has been removed and all its exports were moved to `@emotion/react` package.
// { useTheme, ThemeProvider, withTheme }
// import { ThemeProvider } from "emotion-theming"; // 從 emotion-theming 中載入 ThemeProvider
import { ThemeProvider } from "@emotion/react";
import { findLocation } from "./utils";

// 定義帶有 styled 的 component
// 定義主題配色
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 2px 6px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282"
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
    borderRadius: "14px"
  }
};
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 定義 getMoment 方法
const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  if (!location) return null;

  const now = new Date();
  const nowDate = Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  })
    .format(now)
    .replace(/\//g, "-");

  const locationDate =
    location.time && location.time.find((time) => time.dataTime === nowDate);
  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimeStamp = now.getTime();

  return sunriseTimestamp <= nowTimeStamp && nowTimeStamp <= sunsetTimestamp
    ? "day"
    : "night";
};

// 把定義好的 styled-component 當成組件使用
const WeatherApp = () => {
  // 從 瀏覽器的localStorage 取出 cityName，並取名為 storageCity
  const storageCity = localStorage.getItem("cityName");

  // 根據 currentCity 來找出對應到不同 API 時顯示的地區名稱，找到的地區取名為 locationInfo
  // 若 storageCity 存在則作為 currentCity 的預設值，否則使用 '臺北市'
  const [currentCity, setCurrentCity] = useState(storageCity || "臺北市");
  const currentLocation = findLocation(currentCity) || {};

  // 使用 useWeatherApi Hook 後就能取得 weatherElement 和 fetchData 這兩個方法
  const [weatherElement, fetchData] = useWeatherApi(currentLocation); // 把 currentLocation 傳入
  // 使用 useState 並定義 currentTheme 的預設值為 light
  const [currentTheme, setCurrentTheme] = useState("light");
  const [currentPage, setCurrentPage] = useState("WeatherCard");

  // React 中對於物件類型的資料，經常會使用物件的解構賦值先把要使用到的資料取出來
  // 如此，在 return 的地方就可以直接使用這些變數，而不需要在前面多加上 weatherElement.ooo
  // const { locationName } = weatherElement;

  // 透過 useMemo 避免每次都須重新計算取值，記得帶入 dependencies
  // const moment = useMemo(() => getMoment(locationName), [locationName]);
  const moment = useMemo(() => getMoment(currentLocation.sunriseCityName), [
    currentLocation.sunriseCityName
  ]);

  // 根據 moment 決定要使用亮色或暗色主題
  useEffect(() => {
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);
  // 當 currentCity 有改變的時候，儲存到 localStorage 中
  useEffect(() => {
    localStorage.setItem("cityName", currentCity);
    // dependencies 中放入 currentCity
  }, [currentCity]);

  return (
    // 把所有會用到主題配色的部分都包在 ThemeProvider 內 透過 theme 這個 props 傳入深色主題
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/* 利用條件渲染的方式決定要呈現哪個組件，使用 && 判斷式決定要呈現哪個組件 */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={currentLocation.cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={currentLocation.cityName}
            setCurrentCity={setCurrentCity}
            setCurrentPage={setCurrentPage}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
