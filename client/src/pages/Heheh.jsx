import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProvinces,
  fetchCities,
} from "../store/locationSlice/locationSlice";
import { BiChevronDown } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
// import axios from "axios";
import { fetchShippingCosts } from "../store/shippingCostSlice/shippingCostSlice";

const LocationForm = () => {
  const dispatch = useDispatch();

  const { provinces, cities, isLoading } = useSelector(
    (state) => state.location
  );
  const { costs } = useSelector(
    (state) => state.shipping
  );

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [inputValueProvince, setInpuValueProvince] = useState("");
  const [selectorProvince, setSelectorProvince] = useState("");
  const [openProvice, setOpenProvince] = useState(false);
  const selectorProvinceRef = useRef(null);

  const [inputValueCity, setInpuValueCity] = useState("");
  const [selectorCity, setSelectorCity] = useState("");
  const [openCity, setOpenCity] = useState(false);
  const selectorCityRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProvinces())
      .unwrap()
      .catch((error) => console.error("Error fetching provinces:", error));
  }, [dispatch]);

  useEffect(() => {
    if (selectedProvince) {
      dispatch(fetchCities(selectedProvince));
    }
  }, [selectedProvince, dispatch]);

  //////////////////////////////////////////////
  const handleClickOutsideProvince = (event) => {
    if (
      selectorProvinceRef.current &&
      !selectorProvinceRef.current.contains(event.target)
    ) {
      setOpenProvince(false);
    }
  };

  const handleClickOutsideCity = (event) => {
    if (
      selectorCityRef.current &&
      !selectorCityRef.current.contains(event.target)
    ) {
      setOpenCity(false);
    }
  };

  useEffect(() => {
    if (openProvice) {
      document.addEventListener("mousedown", handleClickOutsideProvince);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideProvince);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProvince);
    };
  }, [openProvice]);

  useEffect(() => {
    if (openCity) {
      document.addEventListener("mousedown", handleClickOutsideCity);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideCity);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideCity);
    };
  }, [openCity]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <form>
        <div className="w-72 font-medium relative">
          <div>Provinsi:</div>
          <div
            onClick={() => setOpenProvince(!openProvice)}
            className={bg-white w-full p-2 flex items-center justify-between rounded border border-primary-dark ${
              !selectorProvince && "text-gray-700"
            }}
          >
            {selectorProvince
              ? selectorProvince?.length > 25
                ? selectorProvince?.substring(0, 25) + "..."
                : selectorProvince
              : "Pilih Provinsi"}
            <BiChevronDown
              size={20}
              className={${openProvice ? "rotate-180" : ""}}
            />
          </div>
          <div
            className={w-full h-11 bg-gray-800 opacity-0 top-6 absolute ${
              !openProvice && "hidden"
            }}
          ></div>
          <ul
            ref={selectorProvinceRef}
            className={bg-white mt-2 overflow-y-auto border border-primary ${
              openProvice ? "max-h-60" : "hidden"
            }}
          >
            <div className="flex items-center px-2 sticky top-0 bg-white">
              <IoSearchOutline size={18} className="text-gray-900" />
              <input
                type="text"
                value={inputValueProvince}
                onChange={(e) =>
                  setInpuValueProvince(e.target.value.toLowerCase())
                }
                placeholder="Cari provinsi"
                className="placeholder:text-gray-700 p-2 outline-none"
              />
            </div>
            {provinces?.map((province) => (
              <li
                key={province.province_id}
                className={p-2 text-sm hover:bg-sky-600 hover:text-white 
                ${
                  province?.province?.toLowerCase() ===
                    selectorProvince?.toLowerCase() && "bg-sky-600 text-white"
                }
                ${
                  province?.province?.toLowerCase().includes(inputValueProvince)
                    ? "block"
                    : "hidden"
                }}
                onClick={() => {
                  if (
                    province?.province?.toLowerCase() !==
                    selectorProvince.toLowerCase()
                  ) {
                    setSelectorProvince(province?.province);
                    setSelectedProvince(province?.province_id);
                  }
                  setOpenProvince(false);
                  setInpuValueProvince("");
                }}
              >
                {province.province}
              </li>
            ))}
          </ul>
        </div>

        <div className="w-72 font-medium relative">
          <div>Kota:</div>
          <div
            onClick={() => setOpenCity(!openCity)}
            className={bg-white w-full p-2 flex items-center justify-between rounded border border-primary-dark ${
              !selectorCity && "text-gray-700"
            }}
          >
            {selectorCity
              ? selectorCity?.length > 25
                ? selectorCity?.substring(0, 25) + "..."
                : selectorCity
              : "Pilih Kota"}
            <BiChevronDown
              size={20}
              className={${openCity ? "rotate-180" : ""}}
            />
          </div>
          <div
            className={w-full h-11 bg-gray-800 opacity-0 top-6 absolute ${
              !openCity && "hidden"
            }}
          ></div>
          {selectedProvince ? (
            <ul
              ref={selectorCityRef}
              className={bg-white mt-2 overflow-y-auto ${
                openCity ? "max-h-60" : "max-h-0"
              }}
            >
              <div className="flex items-center px-2 sticky top-0 bg-white">
                <IoSearchOutline size={18} className="text-gray-900" />
                <input
                  type="text"
                  value={inputValueCity}
                  onChange={(e) =>
                    setInpuValueCity(e.target.value.toLowerCase())
                  }
                  placeholder="Cari kota"
                  className="placeholder:text-gray-700 p-2 outline-none"
                />
              </div>
              {cities?.map((city) => (
                <li
                  key={city.city_id}
                  className={p-2 text-sm hover:bg-sky-600 hover:text-white 
                ${
                  city?.city_name?.toLowerCase() ===
                    selectorCity?.toLowerCase() && "bg-sky-600 text-white"
                }
                ${
                  city?.city_name?.toLowerCase().includes(inputValueCity)
                    ? "block"
                    : "hidden"
                }}
                  onClick={() => {
                    if (
                      city?.city_name?.toLowerCase() !==
                      selectorCity.toLowerCase()
                    ) {
                      setSelectorCity(city?.city_name);
                      setSelectedCity(city?.city_id);
                    }
                    setOpenCity(false);
                    setInpuValueCity("");
                  }}
                >
                  {city?.city_name}
                </li>
              ))}
            </ul>
          ) : (
            <div
              ref={selectorCityRef}
              className={bg-white text-red-500 font-normal ml-1 overflow-y-auto ${
                !openCity ? "hidden" : ""
              }}
            >
              Pilih Provinsi Dulu
            </div>
          )}
        </div>

        <button type="submit" disabled={!selectedCity}>
          Submit
        </button>
      </form>

      <div>
        <h1>Shipping Cost Calculator</h1>
        <select value={courier} onChange={(e) => setCourier(e.target.value)}>
          <option value="jne">JNE</option>
          <option value="pos">POS Indonesia</option>
          <option value="tiki">TIKI</option>
        </select>
        <button onClick={handleFetchCosts}>Get Shipping Costs</button>

        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        {costs.length > 0 && (
          <ul>
            {costs.map((cost) => (
              <li key={cost.service}>
                {cost.service}: {cost.cost[0].value} IDR - {cost.cost[0].etd}{" "}
                days
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
 
export default LocationForm; 