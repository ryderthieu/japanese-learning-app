import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { CourseInfo } from '../../../components/Card/Card';
import { AuthContext } from '../../../context/AuthContext';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { LoadingContext } from '../../../context/LoadingContext';
import Loading from '../../../components/Loading/Loading';
import LottieView from 'lottie-react-native';
import BASE_URL from '../../../api/config';
const MyCourses = ({ navigation }) => {
  const isFocus = useIsFocused()
  const { token } = useContext(AuthContext)
  const [allCourses, setAllCourses] = useState([]);
  const { isLoading, setIsLoading } = useContext(LoadingContext)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(`${BASE_URL}/user/get-user-courses`, {
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
      {allCourses.length > 0 ? (<FlatList
        data={allCourses}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Lessons', { course: item })}
            className="mb-4"
          >
            <CourseInfo item={item} />
          </TouchableOpacity>
        )}
      />)
        : (
          <View className="flex-col items-center bg-white shadow-lg rounded-lg p-4 mb-4 gap-4 flex-1 justify-center">
            <LottieView
              source={require('../../../assets/animate/nodata.json')}
              autoPlay
              loop
              style={{ width: 300, height: 300, alignSelf: 'center' }}
              speed={3}
            />
          </View>
        )
      }

    </View>
  );
};

export default MyCourses;
