// Bangladesh Districts and Upazilas Data
// Source: https://github.com/nuhil/bangladesh-geocode

const districts = [
  {
    id: '1',
    name: 'Dhaka',
    bn_name: 'ঢাকা',
    lat: '23.7115253',
    lon: '90.4111451',
    upazilas: [
      { id: '1', name: 'Dhamrai', bn_name: 'ধামরাই' },
      { id: '2', name: 'Dohar', bn_name: 'দোহার' },
      { id: '3', name: 'Keraniganj', bn_name: 'কেরানীগঞ্জ' },
      { id: '4', name: 'Nawabganj', bn_name: 'নবাবগঞ্জ' },
      { id: '5', name: 'Savar', bn_name: 'সাভার' },
    ]
  },
  {
    id: '2',
    name: 'Faridpur',
    bn_name: 'ফরিদপুর',
    lat: '23.6070822',
    lon: '89.8429406',
    upazilas: [
      { id: '6', name: 'Alfadanga', bn_name: 'আলফাডাঙ্গা' },
      { id: '7', name: 'Bhanga', bn_name: 'ভাঙ্গা' },
      { id: '8', name: 'Boalmari', bn_name: 'বোয়ালমারী' },
      { id: '9', name: 'Charbhadrasan', bn_name: 'চরভদ্রাসন' },
      { id: '10', name: 'Faridpur Sadar', bn_name: 'ফরিদপুর সদর' },
      { id: '11', name: 'Madhukhali', bn_name: 'মধুখালী' },
      { id: '12', name: 'Nagarkanda', bn_name: 'নগরকান্দা' },
      { id: '13', name: 'Sadarpur', bn_name: 'সদরপুর' },
      { id: '14', name: 'Saltha', bn_name: 'সালথা' },
    ]
  },
  {
    id: '3',
    name: 'Gazipur',
    bn_name: 'গাজীপুর',
    lat: '24.0022858',
    lon: '90.4264283',
    upazilas: [
      { id: '15', name: 'Gazipur Sadar', bn_name: 'গাজীপুর সদর' },
      { id: '16', name: 'Kaliakair', bn_name: 'কালিয়াকৈর' },
      { id: '17', name: 'Kaliganj', bn_name: 'কালীগঞ্জ' },
      { id: '18', name: 'Kapasia', bn_name: 'কাপাসিয়া' },
      { id: '19', name: 'Sreepur', bn_name: 'শ্রীপুর' },
    ]
  },
  {
    id: '4',
    name: 'Gopalganj',
    bn_name: 'গোপালগঞ্জ',
    lat: '23.0050857',
    lon: '89.8266059',
    upazilas: [
      { id: '20', name: 'Gopalganj Sadar', bn_name: 'গোপালগঞ্জ সদর' },
      { id: '21', name: 'Kashiani', bn_name: 'কাশিয়ানী' },
      { id: '22', name: 'Kotalipara', bn_name: 'কোটালীপাড়া' },
      { id: '23', name: 'Muksudpur', bn_name: 'মুকসুদপুর' },
      { id: '24', name: 'Tungipara', bn_name: 'টুঙ্গিপাড়া' },
    ]
  },
  {
    id: '5',
    name: 'Jamalpur',
    bn_name: 'জামালপুর',
    lat: '24.937533',
    lon: '89.937775',
    upazilas: [
      { id: '25', name: 'Baksiganj', bn_name: 'বকসীগঞ্জ' },
      { id: '26', name: 'Dewanganj', bn_name: 'দেওয়ানগঞ্জ' },
      { id: '27', name: 'Islampur', bn_name: 'ইসলামপুর' },
      { id: '28', name: 'Jamalpur Sadar', bn_name: 'জামালপুর সদর' },
      { id: '29', name: 'Madarganj', bn_name: 'মাদারগঞ্জ' },
      { id: '30', name: 'Melandaha', bn_name: 'মেলান্দহ' },
      { id: '31', name: 'Sarishabari', bn_name: 'সরিষাবাড়ী' },
    ]
  },
  {
    id: '6',
    name: 'Kishoreganj',
    bn_name: 'কিশোরগঞ্জ',
    lat: '24.444937',
    lon: '90.776575',
    upazilas: [
      { id: '32', name: 'Austagram', bn_name: 'অষ্টগ্রাম' },
      { id: '33', name: 'Bajitpur', bn_name: 'বাজিতপুর' },
      { id: '34', name: 'Bhairab', bn_name: 'ভৈরব' },
      { id: '35', name: 'Hossainpur', bn_name: 'হোসেনপুর' },
      { id: '36', name: 'Itna', bn_name: 'ইটনা' },
      { id: '37', name: 'Karimganj', bn_name: 'করিমগঞ্জ' },
      { id: '38', name: 'Katiadi', bn_name: 'কটিয়াদী' },
      { id: '39', name: 'Kishoreganj Sadar', bn_name: 'কিশোরগঞ্জ সদর' },
      { id: '40', name: 'Kuliarchar', bn_name: 'কুলিয়ারচর' },
      { id: '41', name: 'Mithamain', bn_name: 'মিঠামইন' },
      { id: '42', name: 'Nikli', bn_name: 'নিকলী' },
      { id: '43', name: 'Pakundia', bn_name: 'পাকুন্দিয়া' },
      { id: '44', name: 'Tarail', bn_name: 'তাড়াইল' },
    ]
  },
  {
    id: '7',
    name: 'Madaripur',
    bn_name: 'মাদারীপুর',
    lat: '23.164102',
    lon: '90.1896805',
    upazilas: [
      { id: '45', name: 'Kalkini', bn_name: 'কালকিনি' },
      { id: '46', name: 'Madaripur Sadar', bn_name: 'মাদারীপুর সদর' },
      { id: '47', name: 'Rajoir', bn_name: 'রাজৈর' },
      { id: '48', name: 'Shibchar', bn_name: 'শিবচর' },
    ]
  },
  {
    id: '8',
    name: 'Manikganj',
    bn_name: 'মানিকগঞ্জ',
    lat: '23.8644',
    lon: '90.0047',
    upazilas: [
      { id: '49', name: 'Daulatpur', bn_name: 'দৌলতপুর' },
      { id: '50', name: 'Ghior', bn_name: 'ঘিওর' },
      { id: '51', name: 'Harirampur', bn_name: 'হরিরামপুর' },
      { id: '52', name: 'Manikganj Sadar', bn_name: 'মানিকগঞ্জ সদর' },
      { id: '53', name: 'Saturia', bn_name: 'সাটুরিয়া' },
      { id: '54', name: 'Shivalaya', bn_name: 'শিবালয়' },
      { id: '55', name: 'Singair', bn_name: 'সিংগাইর' },
    ]
  },
  {
    id: '9',
    name: 'Munshiganj',
    bn_name: 'মুন্সিগঞ্জ',
    lat: '23.5422',
    lon: '90.5305',
    upazilas: [
      { id: '56', name: 'Gazaria', bn_name: 'গজারিয়া' },
      { id: '57', name: 'Lohajang', bn_name: 'লৌহজং' },
      { id: '58', name: 'Munshiganj Sadar', bn_name: 'মুন্সিগঞ্জ সদর' },
      { id: '59', name: 'Sirajdikhan', bn_name: 'সিরাজদিখান' },
      { id: '60', name: 'Sreenagar', bn_name: 'শ্রীনগর' },
      { id: '61', name: 'Tongibari', bn_name: 'টঙ্গিবাড়ী' },
    ]
  },
  {
    id: '10',
    name: 'Mymensingh',
    bn_name: 'ময়মনসিংহ',
    lat: '24.746567',
    lon: '90.407209',
    upazilas: [
      { id: '62', name: 'Bhaluka', bn_name: 'ভালুকা' },
      { id: '63', name: 'Dhobaura', bn_name: 'ধোবাউড়া' },
      { id: '64', name: 'Fulbaria', bn_name: 'ফুলবাড়ীয়া' },
      { id: '65', name: 'Gaffargaon', bn_name: 'গফরগাঁও' },
      { id: '66', name: 'Gauripur', bn_name: 'গৌরীপুর' },
      { id: '67', name: 'Haluaghat', bn_name: 'হালুয়াঘাট' },
      { id: '68', name: 'Ishwarganj', bn_name: 'ঈশ্বরগঞ্জ' },
      { id: '69', name: 'Mymensingh Sadar', bn_name: 'ময়মনসিংহ সদর' },
      { id: '70', name: 'Muktagacha', bn_name: 'মুক্তাগাছা' },
      { id: '71', name: 'Nandail', bn_name: 'নান্দাইল' },
      { id: '72', name: 'Phulpur', bn_name: 'ফুলপুর' },
      { id: '73', name: 'Trishal', bn_name: 'ত্রিশাল' },
    ]
  },
  {
    id: '11',
    name: 'Narayanganj',
    bn_name: 'নারায়ণগঞ্জ',
    lat: '23.63366',
    lon: '90.496482',
    upazilas: [
      { id: '74', name: 'Araihazar', bn_name: 'আড়াইহাজার' },
      { id: '75', name: 'Bandar', bn_name: 'বন্দর' },
      { id: '76', name: 'Narayanganj Sadar', bn_name: 'নারায়ণগঞ্জ সদর' },
      { id: '77', name: 'Rupganj', bn_name: 'রূপগঞ্জ' },
      { id: '78', name: 'Sonargaon', bn_name: 'সোনারগাঁও' },
    ]
  },
  {
    id: '12',
    name: 'Narsingdi',
    bn_name: 'নরসিংদী',
    lat: '23.932233',
    lon: '90.71541',
    upazilas: [
      { id: '79', name: 'Belabo', bn_name: 'বেলাবো' },
      { id: '80', name: 'Monohardi', bn_name: 'মনোহরদী' },
      { id: '81', name: 'Narsingdi Sadar', bn_name: 'নরসিংদী সদর' },
      { id: '82', name: 'Palash', bn_name: 'পলাশ' },
      { id: '83', name: 'Raipura', bn_name: 'রায়পুরা' },
      { id: '84', name: 'Shibpur', bn_name: 'শিবপুর' },
    ]
  },
  {
    id: '13',
    name: 'Netrakona',
    bn_name: 'নেত্রকোণা',
    lat: '24.870955',
    lon: '90.727887',
    upazilas: [
      { id: '85', name: 'Atpara', bn_name: 'আটপাড়া' },
      { id: '86', name: 'Barhatta', bn_name: 'বারহাট্টা' },
      { id: '87', name: 'Durgapur', bn_name: 'দুর্গাপুর' },
      { id: '88', name: 'Khaliajuri', bn_name: 'খালিয়াজুরী' },
      { id: '89', name: 'Kalmakanda', bn_name: 'কলমাকান্দা' },
      { id: '90', name: 'Kendua', bn_name: 'কেন্দুয়া' },
      { id: '91', name: 'Madan', bn_name: 'মদন' },
      { id: '92', name: 'Mohanganj', bn_name: 'মোহনগঞ্জ' },
      { id: '93', name: 'Netrakona Sadar', bn_name: 'নেত্রকোণা সদর' },
      { id: '94', name: 'Purbadhala', bn_name: 'পূর্বধলা' },
    ]
  },
  {
    id: '14',
    name: 'Rajbari',
    bn_name: 'রাজবাড়ী',
    lat: '23.7574305',
    lon: '89.6444665',
    upazilas: [
      { id: '95', name: 'Baliakandi', bn_name: 'বালিয়াকান্দি' },
      { id: '96', name: 'Goalandaghat', bn_name: 'গোয়ালন্দ ঘাট' },
      { id: '97', name: 'Pangsha', bn_name: 'পাংশা' },
      { id: '98', name: 'Rajbari Sadar', bn_name: 'রাজবাড়ী সদর' },
      { id: '99', name: 'Kalukhali', bn_name: 'কালুখালী' },
    ]
  },
  {
    id: '15',
    name: 'Shariatpur',
    bn_name: 'শরীয়তপুর',
    lat: '23.242321',
    lon: '90.434771',
    upazilas: [
      { id: '100', name: 'Bhedarganj', bn_name: 'ভেদরগঞ্জ' },
      { id: '101', name: 'Damudya', bn_name: 'ডামুড্যা' },
      { id: '102', name: 'Gosairhat', bn_name: 'গোসাইরহাট' },
      { id: '103', name: 'Naria', bn_name: 'নড়িয়া' },
      { id: '104', name: 'Shariatpur Sadar', bn_name: 'শরিয়তপুর সदর' },
      { id: '105', name: 'Zajira', bn_name: 'জাজিরা' },
    ]
  },
  {
    id: '16',
    name: 'Sherpur',
    bn_name: 'শেরপুর',
    lat: '25.0204933',
    lon: '90.0152966',
    upazilas: [
      { id: '106', name: 'Jhenaigati', bn_name: 'ঝিনাইগাতী' },
      { id: '107', name: 'Nakla', bn_name: 'নকলা' },
      { id: '108', name: 'Nalitabari', bn_name: 'নালিতাবাড়ী' },
      { id: '109', name: 'Sherpur Sadar', bn_name: 'শেরপুর সদর' },
      { id: '110', name: 'Sreebardi', bn_name: 'শ্রীবরদী' },
    ]
  },
  {
    id: '17',
    name: 'Tangail',
    bn_name: 'টাঙ্গাইল',
    lat: '24.2513',
    lon: '89.9167',
    upazilas: [
      { id: '111', name: 'Tangail Sadar', bn_name: 'টাঙ্গাইল সদর' },
      { id: '112', name: 'Sakhipur', bn_name: 'সখিপুর' },
      { id: '113', name: 'Basail', bn_name: 'বাসাইল' },
      { id: '114', name: 'Madhupur', bn_name: 'মধুপুর' },
      { id: '115', name: 'Ghatail', bn_name: 'ঘাটাইল' },
      { id: '116', name: 'Kalihati', bn_name: 'কালিহাতী' },
      { id: '117', name: 'Nagarpur', bn_name: 'নাগরপুর' },
      { id: '118', name: 'Mirzapur', bn_name: 'মির্জাপুর' },
      { id: '119', name: 'Gopalpur', bn_name: 'গোপালপুর' },
      { id: '120', name: 'Delduar', bn_name: 'দেলদুয়ার' },
      { id: '121', name: 'Bhuapur', bn_name: 'ভুয়াপুর' },
      { id: '122', name: 'Dhanbari', bn_name: 'ধনবাড়ী' },
    ]
  },
];

// Helper functions
export const getDistricts = () => {
  return districts.map(district => ({
    id: district.id,
    name: district.name,
    bn_name: district.bn_name,
    lat: district.lat,
    lon: district.lon,
  }));
};

export const getDistrictById = (districtId) => {
  return districts.find(district => district.id === districtId || district.name === districtId);
};

export const getDistrictByName = (districtName) => {
  return districts.find(district => 
    district.name.toLowerCase() === districtName.toLowerCase() ||
    district.bn_name === districtName
  );
};

export const getUpazilasByDistrict = (districtId) => {
  const district = getDistrictById(districtId);
  return district ? district.upazilas : [];
};

export const getUpazilaById = (upazilaId) => {
  for (const district of districts) {
    const upazila = district.upazilas.find(up => up.id === upazilaId || up.name === upazilaId);
    if (upazila) {
      return {
        ...upazila,
        district_id: district.id,
        district_name: district.name,
      };
    }
  }
  return null;
};

export const getUpazilaByName = (upazilaName, districtId = null) => {
  if (districtId) {
    const district = getDistrictById(districtId);
    if (district) {
      return district.upazilas.find(up => 
        up.name.toLowerCase() === upazilaName.toLowerCase() ||
        up.bn_name === upazilaName
      );
    }
  } else {
    for (const district of districts) {
      const upazila = district.upazilas.find(up => 
        up.name.toLowerCase() === upazilaName.toLowerCase() ||
        up.bn_name === upazilaName
      );
      if (upazila) {
        return {
          ...upazila,
          district_id: district.id,
          district_name: district.name,
        };
      }
    }
  }
  return null;
};

export const searchDistricts = (query) => {
  if (!query) return getDistricts();
  
  const searchTerm = query.toLowerCase();
  return districts
    .filter(district => 
      district.name.toLowerCase().includes(searchTerm) ||
      district.bn_name.includes(searchTerm)
    )
    .map(district => ({
      id: district.id,
      name: district.name,
      bn_name: district.bn_name,
    }));
};

export const searchUpazilas = (query, districtId = null) => {
  let upazilas = [];
  
  if (districtId) {
    upazilas = getUpazilasByDistrict(districtId);
  } else {
    districts.forEach(district => {
      upazilas = [...upazilas, ...district.upazilas.map(up => ({
        ...up,
        district_id: district.id,
        district_name: district.name,
      }))];
    });
  }
  
  if (!query) return upazilas;
  
  const searchTerm = query.toLowerCase();
  return upazilas.filter(upazila => 
    upazila.name.toLowerCase().includes(searchTerm) ||
    upazila.bn_name.includes(searchTerm)
  );
};

export const getLocationFullName = (districtId, upazilaId) => {
  const district = getDistrictById(districtId);
  const upazila = getUpazilaById(upazilaId);
  
  if (!district && !upazila) return '';
  
  if (district && upazila) {
    return `${upazila.name}, ${district.name}`;
  }
  
  return district?.name || upazila?.name || '';
};

export const getLocationOptions = () => {
  return districts.map(district => ({
    value: district.id,
    label: district.name,
    upazilas: district.upazilas.map(upazila => ({
      value: upazila.id,
      label: upazila.name,
    })),
  }));
};

export const getAllUpazilas = () => {
  const allUpazilas = [];
  districts.forEach(district => {
    district.upazilas.forEach(upazila => {
      allUpazilas.push({
        ...upazila,
        district_id: district.id,
        district_name: district.name,
      });
    });
  });
  return allUpazilas;
};

export const validateDistrict = (districtId) => {
  return districts.some(district => district.id === districtId);
};

export const validateUpazila = (upazilaId, districtId = null) => {
  if (districtId) {
    const district = getDistrictById(districtId);
    if (!district) return false;
    return district.upazilas.some(upazila => upazila.id === upazilaId);
  }
  
  return getAllUpazilas().some(upazila => upazila.id === upazilaId);
};

export default {
  districts,
  getDistricts,
  getDistrictById,
  getDistrictByName,
  getUpazilasByDistrict,
  getUpazilaById,
  getUpazilaByName,
  searchDistricts,
  searchUpazilas,
  getLocationFullName,
  getLocationOptions,
  getAllUpazilas,
  validateDistrict,
  validateUpazila,
};