import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { CourseInfo } from '../../../components/Card/Card';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { LoadingContext } from '../../../context/LoadingContext';
import Loading from '../../../components/Loading/Loading';

const MyCourses = ({ navigation }) => {
  const isFocus = useIsFocused()
  const {token} = useContext(AuthContext)
  const [allCourses, setAllCourses] = useState ([]);
  const {isLoading, setIsLoading} = useContext(LoadingContext)
  useEffect(() => {
    const fetchData = async () => {
        try {
          setIsLoading(true)
          const response = await axios.get("http://10.0.2.2:3000/api/user/get-user-courses", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAllCourses(response.data.courses);
        } catch (error) {
          console.log(error.message)
        } finally {
          setIsLoading(false)
        }
      };
  
      fetchData(); 
}, [isFocus])

  if (isLoading) return <Loading />
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
