import debounce from "lodash.debounce";

import SearchBox from "@/app/ui/components/SearchBox";
import React, { useEffect, useState } from "react";
import { CityProps, useMapContext } from "../../../context/MapContext";

import ShowToolbar from "../toolbar/ShowToolbar";

const CitySearch = () => {
  const { setCity, loadMap } = useMapContext();

  const [dynamicSearch, setDynamicSearch] = useState("");
  const [searchedCities, setSearchCities] = useState<CityProps[]>([]);

  useEffect(() => {
    if (!loadMap) return;

    const params = dynamicSearch.length > 2 && dynamicSearch;

    const loadCitites = debounce(async () => {
      if (params) {
        const res = await fetch(`/api/arcAI/maps/city`, {
          method: "POST",
          body: JSON.stringify({ city: params }),
        });

        if (res.ok) {
          const cities = await res.json();

          const citiesData = cities.map((c) => {
            const { name, lon, lat } = c;

            return { name, lon, lat };
          });

          setSearchCities(citiesData);

          console.log(citiesData);
        }
      } else {
        setSearchCities([]);
      }
    }, 500);

    loadCitites();
  }, [dynamicSearch, loadMap]);

  return (
    <>
      <ShowToolbar isVertical={false} positionClassNames="top-20 left-40">
        <div className="select-none p-1 px-2 rounded-md bg-slate-300 flex gap-2">
          <SearchBox label="city" setValue={setDynamicSearch} />
        </div>

        {searchedCities.length > 0 && (
          <div className="mt-1 flex flex-col absolute top-ful gap-2  rounded-md w-52 bg-slate-300 opacity-85 shadow-md">
            {searchedCities.map((city, index) => (
              <div key={crypto.randomUUID()}>
                <div
                  className="px-2 py-1 flex flex-col cursor-pointer select-none hover:bg-slate-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCity({ ...city });
                    setSearchCities([]);
                  }}
                >
                  <span className="font-semibold">{city.name}</span>
                  <span className="text-sm">{`Lon: ${city.lon}`}</span>
                  <span className="text-sm">{`Lat: ${city.lat}`}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ShowToolbar>
    </>
  );
};

export default CitySearch;
