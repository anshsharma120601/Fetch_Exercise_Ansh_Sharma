import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        'https://fetch-hiring.s3.amazonaws.com/hiring.json'
      );
      const filteredData = response.data
        // Filter out items with blank or null names
        .filter((item) => item.name && item.name.trim() !== '')
        // Sort items by listId and then by name
        .sort((a, b) => {
          const listIdA = parseInt(a.listId);
          const listIdB = parseInt(b.listId);
          if (listIdA !== listIdB) {
            return listIdA - listIdB;
          } else {
            return (
              parseInt(a.name.match(/\d+/)) - parseInt(b.name.match(/\d+/))
            );
          }
        });
      setData(filteredData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>ListId: {item.listId}</Text>
      <Text>Name: {item.name}</Text>
      <Text>ID: {item.id}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
