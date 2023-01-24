import {React,useState} from "react";
import { View,Text,Button,StyleSheet,ScrollView,TextInput } from 'react-native';
import ToDo from "./Todo";



const TodoList = () => {

    const [list,setList] = useState([]);
    const [text,setText] = useState('Hello World');
    const [title, setTitle] = useState("TodoList");


    // ADD ITEM METHOD
    const addItem = () => {
        const updatedList = list;
        updatedList.push(text);
        setList(updatedList);
        setText("");
    };

    //Delete Item
    const deleteItem = (index) => {
        const updatedList = list.filter((todo) => todo !== index);
        setList(updatedList);
    }


    const styles = StyleSheet.create({
        align: {
          alignSelf: "center",
        },
        font: {
          fontSize: 20,
          fontWeight: "bold",
        },
        input: {
          borderRadius: 5,
          borderWidth: 1,
          marginBottom: 8,
          padding: 8,
        },
      });

    return(
        <View style={{ width: "80%", marginBottom: 60 }}>
        <Text style={[styles.align, styles.font]}>{title}</Text>
        <ScrollView>
          {list.map((x, index) => (
            <ToDo key={index} item={x} index={index} delete={deleteItem}/>
          ))}
        </ScrollView>
        <View>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <Button title="Add item" onPress={addItem} />
        </View>
      </View>
    );

    
}

export default TodoList;