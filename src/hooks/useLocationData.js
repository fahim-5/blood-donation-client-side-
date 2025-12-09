import { useState, useEffect } from 'react';
import locationData from '../utils/locationData';

const useLocationData = () => {
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      setLoading(true);
      
      // If locationData is a function that fetches data
      if (typeof locationData.getDistricts === 'function') {
        const districtsData = await locationData.getDistricts();
        setDistricts(districtsData);
      } else if (Array.isArray(locationData.districts)) {
        // If it's a static array
        setDistricts(locationData.districts);
      } else if (Array.isArray(locationData)) {
        // If the entire module is an array
        setDistricts(locationData);
      }
    } catch (error) {
      console.error('Failed to load districts:', error);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUpazilas = async (districtId) => {
    try {
      setLoading(true);
      setUpazilas([]);
      setSelectedDistrict(districtId);
      
      if (!districtId) {
        setUpazilas([]);
        return;
      }

      // If locationData is a function that fetches data
      if (typeof locationData.getUpazilas === 'function') {
        const upazilasData = await locationData.getUpazilas(districtId);
        setUpazilas(upazilasData);
      } else if (Array.isArray(locationData)) {
        // Find district and get its upazilas
        const district = locationData.find(d => 
          d.id === districtId || d.district_id === districtId || d.name === districtId
        );
        
        if (district && district.upazilas) {
          setUpazilas(district.upazilas);
        } else {
          // Try to find upazilas by filtering
          const filteredUpazilas = locationData
            .filter(item => 
              item.district_id === districtId || 
              item.district === districtId ||
              item.parent === districtId
            )
            .map(item => ({
              id: item.id || item.upazila_id,
              name: item.name || item.upazila,
              bn_name: item.bn_name || item.bn_upazila
            }));
          
          setUpazilas(filteredUpazilas);
        }
      }
    } catch (error) {
      console.error('Failed to load upazilas:', error);
      setUpazilas([]);
    } finally {
      setLoading(false);
    }
  };

  const getDistrictById = (districtId) => {
    return districts.find(d => 
      d.id === districtId || d.district_id === districtId || d.name === districtId
    );
  };

  const getUpazilaById = (upazilaId) => {
    return upazilas.find(u => 
      u.id === upazilaId || u.upazila_id === upazilaId || u.name === upazilaId
    );
  };

  const getDistrictName = (districtId) => {
    const district = getDistrictById(districtId);
    return district ? (district.name || district.district) : '';
  };

  const getUpazilaName = (upazilaId) => {
    const upazila = getUpazilaById(upazilaId);
    return upazila ? (upazila.name || upazila.upazila) : '';
  };

  const getFullLocation = (districtId, upazilaId) => {
    const districtName = getDistrictName(districtId);
    const upazilaName = getUpazilaName(upazilaId);
    
    if (districtName && upazilaName) {
      return `${upazilaName}, ${districtName}`;
    } else if (districtName) {
      return districtName;
    } else if (upazilaName) {
      return upazilaName;
    }
    return '';
  };

  const resetLocation = () => {
    setSelectedDistrict('');
    setUpazilas([]);
  };

  const searchDistricts = (query) => {
    if (!query) return districts;
    
    const searchTerm = query.toLowerCase();
    return districts.filter(district => {
      const name = (district.name || district.district || '').toLowerCase();
      const bnName = (district.bn_name || district.bn_district || '').toLowerCase();
      
      return name.includes(searchTerm) || bnName.includes(searchTerm);
    });
  };

  const searchUpazilas = (query) => {
    if (!query) return upazilas;
    
    const searchTerm = query.toLowerCase();
    return upazilas.filter(upazila => {
      const name = (upazila.name || upazila.upazila || '').toLowerCase();
      const bnName = (upazila.bn_name || upazila.bn_upazila || '').toLowerCase();
      
      return name.includes(searchTerm) || bnName.includes(searchTerm);
    });
  };

  return {
    districts,
    upazilas,
    selectedDistrict,
    loading,
    loadDistricts,
    loadUpazilas,
    getDistrictById,
    getUpazilaById,
    getDistrictName,
    getUpazilaName,
    getFullLocation,
    resetLocation,
    searchDistricts,
    searchUpazilas,
    setSelectedDistrict
  };
};

export default useLocationData;