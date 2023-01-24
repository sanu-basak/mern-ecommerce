import React from "react";
import {View,Text,Button,StyleSheet} from 'react-native';

const ToDo = (props) => {

    const styles = StyleSheet.create({
        item: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderColor: 'grey',
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: 'whitesmoke'
        }
    })
    


    return(
        <View  style={styles.item}>
            <Text style={{  width:'30%',color:'green' }} >{props.item}</Text>
            <Button 
                title={'Delete'}
                color={'red'}
                onPress={() => props.delete(props.item)}
            />
        </View>
    );

   
}

export default ToDo;