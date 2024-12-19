import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { CourseInfo } from '../../../components/Card/Card';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';

const MyCourses = ({ navigation }) => {
  const isFocus = useIsFocused()
  const {token} = useContext(AuthContext)
  const [allCourses, setAllCourses] = useState ([]);
  useEffect(() => {
    const fetchData = async () => {
        try {
          const response = await axios.get("http://192.168.1.47:3000/api/user/get-user-courses", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAllCourses(response.data.courses);
        } catch (error) {
          console.log(error.message)
        }
      };
  
      fetchData(); 
}, [isFocus])
  return (
    <View className="flex-1 p-4">
      <FlatList
        data={allCourses}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Lessons', { course: item })}
            className="mb-4"
          >
            <CourseInfo item={item}/>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MyCourses;
