import React,{useState,useEffect} from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    Text,
    Button
} from 'react-native';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width / 2 - 20,
        height: width / 1.7,
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 8,
        backgroundColor: 'white'
    },
    image: {
        width: width / 2 - 20 - 10,
        height: width / 2 - 20 - 60,
        backgroundColor: 'transparent',
        position: 'absolute',
    },
    card: {
        marginBottom: 10,
        height: width / 2 - 20 - 90,
        backgroundColor: 'transparent',
        width: width / 2 - 20 - 10
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
        marginTop:10,
        textAlign: 'center'
    },
    price: {
        fontSize: 20,
        marginBottom:10,
        color: 'orange',
        marginTop: 10
    }
});

const ProductCard = (props) => {
    const {name,price,image,countInStock} = props;
     return (
        <View style={styles.container}>
            <Image 
                style={styles.image}
                resizeMode="contain"
                source={{ uri: image ? image : 'https://tse2.mm.bing.net/th?id=OIP.uHDol_lnMAJKZG-NG51vOwHaHK&pid=Api&P=0' }}
            />
            <View style={styles.card}/>
            <Text style={styles.title}>
                {
                    name.length > 15 ? name.substring(0,15 -3) + '...'
                    : name
                }
            </Text>
            <Text style={styles.price}>${price}</Text>
            { countInStock > 0 ? (
                <View style={{marginBottom:20}}>
                    <Button title={'ADD'} color={'green'}/>
                </View>
            ) : (
                <Text style={{marginTop:20}}>Currently Unavaliable</Text>
            )}
        </View>
     );
}

export default ProductCard;