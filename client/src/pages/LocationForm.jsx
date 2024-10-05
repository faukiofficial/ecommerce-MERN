import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProvinces,
  fetchCities,
} from "../store/locationSlice/locationSlice";
import { IoSearchOutline } from "react-icons/io5";
import {
  fetchShippingCosts,
  resetShippingState,
} from "../store/shippingCostSlice/shippingCostSlice";

const LocationForm = () => {
  const dispatch = useDispatch();

  const {
    provinces,
    cities,
    isLoading: isLocationLoading,
  } = useSelector((state) => state.location);
  const {
    costs,
    isLoading: isShippingLoading,
    error,
  } = useSelector((state) => state.shipping);

  const [selectedOriginProvince, setSelectedOriginProvince] = useState("");
  const [selectedOriginCity, setSelectedOriginCity] = useState("");
  const [selectedDestinationProvince, setSelectedDestinationProvince] =
    useState("");
  const [selectedDestinationCity, setSelectedDestinationCity] = useState("");
  const [weight, setWeight] = useState(1000);

  const [selectedShipping, setSelectedShipping] = useState(null);

  console.log("ongkir", costs);
  console.log("asal", selectedOriginCity);
  console.log("tujuan", selectedDestinationCity);
  console.log("pilihan", selectedShipping);


  useEffect(() => {
    dispatch(fetchProvinces())
      .unwrap()
      .catch((error) => console.error("Error fetching provinces:", error));
  }, [dispatch]);

  useEffect(() => {
    if (selectedOriginProvince) {
      dispatch(fetchCities(selectedOriginProvince));
    }
  }, [selectedOriginProvince, dispatch]);

  useEffect(() => {
    if (selectedDestinationProvince) {
      dispatch(fetchCities(selectedDestinationProvince));
    }
  }, [selectedDestinationProvince, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetShippingState());
    };
  }, [dispatch]);

  const handleFetchCosts = () => {
    if (!selectedOriginCity || !selectedDestinationCity) return;

    // Fetch shipping costs for all couriers (JNE, POS, TIKI)
    const couriers = ["jne", "pos", "tiki"];
    const fetchPromises = couriers.map((courier) =>
      dispatch(
        fetchShippingCosts({
          origin: selectedOriginCity,
          destination: selectedDestinationCity,
          weight,
          courier,
        })
      )
    );

    // Wait for all promises to resolve
    Promise.all(fetchPromises).catch((error) => {
      console.error("Error fetching shipping costs:", error);
    });
  };

  const handleSelectShipping = (courier, service, costDetail) => {
    setSelectedShipping({ courier, service, costDetail });
  };

  if (isLocationLoading) return <div>Loading location data...</div>;

  return (
    <>
      <div className="form-container flex flex-col gap-4">
        {/* Origin Province selection */}
        <div className="w-72 font-medium relative">
          <div>Provinsi Asal:</div>
          <select
            value={selectedOriginProvince}
            onChange={(e) => setSelectedOriginProvince(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province}
              </option>
            ))}
          </select>
        </div>

        {/* Origin City selection */}
        <div className="w-72 font-medium relative">
          <div>Kota Asal:</div>
          <select
            value={selectedOriginCity}
            onChange={(e) => setSelectedOriginCity(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">Pilih Kota</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Province selection */}
        <div className="w-72 font-medium relative">
          <div>Provinsi Tujuan:</div>
          <select
            value={selectedDestinationProvince}
            onChange={(e) => setSelectedDestinationProvince(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">Pilih Provinsi</option>
            {provinces.map((province) => (
              <option key={province.province_id} value={province.province_id}>
                {province.province}
              </option>
            ))}
          </select>
        </div>

        {/* Destination City selection */}
        <div className="w-72 font-medium relative">
          <div>Kota Tujuan:</div>
          <select
            value={selectedDestinationCity}
            onChange={(e) => setSelectedDestinationCity(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          >
            <option value="">Pilih Kota</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>

        {/* Weight input */}
        <div className="w-72 font-medium">
          <div>Berat (gram):</div>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border border-gray-300 p-2 w-full"
          />
        </div>

        <button
          className="mt-4 bg-blue-500 text-white p-2 rounded h-12"
          onClick={handleFetchCosts}
        >
          Get Shipping Costs
        </button>
      </div>

      {/* Shipping cost results */}
      {isShippingLoading && <div>Loading shipping costs...</div>}
      {error && <div>Error: {error}</div>}
      {costs.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Shipping Costs:</h2>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Select
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Courier
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Service
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Cost (IDR)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Estimated Delivery (days)
                </th>
              </tr>
            </thead>
            <tbody>
              {costs.map((courier) =>
                courier.costs.map((service) =>
                  service.cost.map((costDetail, index) => (
                    <tr
                      key={`${courier.code}-${service.service}-${index}`}
                      className="hover:bg-gray-100"
                    >
                      <td className="border border-gray-300 px-4 py-2">
                        <input
                          type="radio"
                          name="selectedShipping"
                          value={`${courier.code}-${service.service}`}
                          onChange={() =>
                            handleSelectShipping(courier, service, costDetail)
                          }
                          checked={
                            selectedShipping?.courier?.code === courier.code &&
                            selectedShipping?.service?.service ===
                              service.service
                          }
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {courier.name}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {service.service}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {service.description}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {costDetail.value}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {costDetail.etd.includes("HARI")
                          ? costDetail.etd
                          : costDetail.etd + " HARI"}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Display selected shipping option */}
      {selectedShipping && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Selected Shipping:</h3>
          <p>
            Courier: {selectedShipping.courier.name} <br />
            Service: {selectedShipping.service.service} <br />
            Cost: {selectedShipping.costDetail.value} <br />
            Estimated Delivery: {selectedShipping.costDetail.etd} days
          </p>
        </div>
      )}
    </>
  );
};

export default LocationForm;






//////////////////////////



// {/* <form>
//         {/* Province selection */}
//         <div className="w-72 font-medium relative">
//           <div>Provinsi:</div>
//           <div
//             onClick={() => setOpenProvince(!openProvince)}
//             className={`bg-white w-full p-2 flex items-center justify-between rounded border border-primary-dark ${
//               !selectorProvince && "text-gray-700"
//             }`}
//           >
//             {selectorProvince
//               ? selectorProvince.length > 25
//                 ? selectorProvince.substring(0, 25) + "..."
//                 : selectorProvince
//               : "Pilih Provinsi"}
//             <BiChevronDown
//               size={20}
//               className={`${openProvince ? "rotate-180" : ""}`}
//             />
//           </div>
//           <ul
//             ref={selectorProvinceRef}
//             className={`bg-white mt-2 overflow-y-auto border border-primary ${
//               openProvince ? "max-h-60" : "hidden"
//             }`}
//           >
//             <div className="flex items-center px-2 sticky top-0 bg-white">
//               <IoSearchOutline size={18} className="text-gray-900" />
//               <input
//                 type="text"
//                 value={inputValueProvince}
//                 onChange={(e) =>
//                   setInputValueProvince(e.target.value.toLowerCase())
//                 }
//                 placeholder="Cari provinsi"
//                 className="placeholder:text-gray-700 p-2 outline-none"
//               />
//             </div>
//             {provinces?.map((province) => (
//               <li
//                 key={province.province_id}
//                 className={`p-2 text-sm hover:bg-sky-600 hover:text-white ${
//                   province.province.toLowerCase() === selectorProvince.toLowerCase() &&
//                   "bg-sky-600 text-white"
//                 } ${province.province
//                   .toLowerCase()
//                   .includes(inputValueProvince) ? "block" : "hidden"}`}
//                 onClick={() => {
//                   if (province.province.toLowerCase() !== selectorProvince.toLowerCase()) {
//                     setSelectorProvince(province.province);
//                     setSelectedProvince(province.province_id);
//                   }
//                   setOpenProvince(false);
//                   setInputValueProvince("");
//                 }}
//               >
//                 {province.province}
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* City selection */}
//         <div className="w-72 font-medium relative">
//           <div>Kota:</div>
//           <div
//             onClick={() => setOpenCity(!openCity)}
//             className={`bg-white w-full p-2 flex items-center justify-between rounded border border-primary-dark ${
//               !selectorCity && "text-gray-700"
//             }`}
//           >
//             {selectorCity
//               ? selectorCity.length > 25
//                 ? selectorCity.substring(0, 25) + "..."
//                 : selectorCity
//               : "Pilih Kota"}
//             <BiChevronDown
//               size={20}
//               className={`${openCity ? "rotate-180" : ""}`}
//             />
//           </div>
//           {selectedProvince ? (
//             <ul
//               ref={selectorCityRef}
//               className={`bg-white mt-2 overflow-y-auto ${
//                 openCity ? "max-h-60" : "max-h-0"
//               }`}
//             >
//               <div className="flex items-center px-2 sticky top-0 bg-white">
//                 <IoSearchOutline size={18} className="text-gray-900" />
//                 <input
//                   type="text"
//                   value={inputValueCity}
//                   onChange={(e) =>
//                     setInputValueCity(e.target.value.toLowerCase())
//                   }
//                   placeholder="Cari kota"
//                   className="placeholder:text-gray-700 p-2 outline-none"
//                 />
//               </div>
//               {cities?.map((city) => (
//                 <li
//                   key={city.city_id}
//                   className={`p-2 text-sm hover:bg-sky-600 hover:text-white ${
//                     city.city_name.toLowerCase() === selectorCity.toLowerCase() &&
//                     "bg-sky-600 text-white"
//                   } ${city.city_name.toLowerCase().includes(inputValueCity)
//                     ? "block"
//                     : "hidden"}`}
//                   onClick={() => {
//                     if (city.city_name.toLowerCase() !== selectorCity.toLowerCase()) {
//                       setSelectorCity(city.city_name);
//                       setSelectedCity(city.city_id);
//                     }
//                     setOpenCity(false);
//                     setInputValueCity("");
//                   }}
//                 >
//                   {city.city_name}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <div className="bg-white text-red-500">Pilih Provinsi Dulu</div>
//           )}
//         </div>

//         <button type="submit" disabled={!selectedCity}>
//           Submit
//         </button>
//       </form> */}
