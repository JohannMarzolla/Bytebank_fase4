
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { db } from "../../../../firebase/config"
import { collection, getDocs } from "firebase/firestore";


export default function Home() {

    const [dados, setDados] = useState<any>([]);
    const [nome, setNome] =  useState<string>();
    const [id, setId] =  useState<any>();
    const [preco, setPreco] =  useState<number>();


    useEffect(() => {
        // Função assíncrona dentro do useEffect
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Teste"));
                   const document = querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                    setId(doc.id);
                    setNome(doc.data().nome)
                    setPreco(doc.data().preco)
                }
        );
       
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };
        fetchData();
    }, []); // Array de dependências
    console.log("dados", dados)

  
    return(
        <View>
            <Text>Home</Text>
            <View>
                <Text>{id}</Text>
                <Text>{nome}</Text>
                <Text>{preco}</Text>
            </View>
            
        </View>
    )
}
