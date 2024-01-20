import { Text,Stack,Flex, Heading,Image,Grid,Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState,useRef } from 'react';
import Time from "./component/time";
import timeIcon from "./icon/time.svg";
import bombIcon from "./icon/bomb.svg";

function App() {
  const [table,setTable]=useState([]);
  const [isOpen,setOpen]=useState(false);
  const [restart,setStart]=useState(false);
  const [lose,setLose]=useState(false);
  var map_row=10;
  var map_col=10;
  var map_bomb=20;
  var map_clear=80;
  //const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(()=>{
    const shuffleArray=new Array();
    for(let a_i=0;a_i<map_row;a_i++){
      shuffleArray.push(new Array());
      for(let a_j=0;a_j<map_col;a_j++){
        shuffleArray[a_i].push({bomb:false,count:0,isOpen:false});
      }
    }
    let bombCount=map_bomb;
    while(bombCount>0){
      let j=Math.floor(Math.random()*(map_row));
      let i=Math.floor(Math.random()*(map_col));
      if(!shuffleArray[i][j].bomb){
        shuffleArray[i][j].bomb=true;
        for(let k=i-1;k<i+2;k++){
          for(let p=j-1;p<j+2;p++){
            if(k>-1 && k<map_row && p>-1 && p<map_col)shuffleArray[k][p].count++;
          }
        }
        bombCount--;
      }
    }
    setTable(shuffleArray);
  },[restart]);//[] means only run one time in the begining.

  const ModalOpen=(open)=>{
    if(!open)setStart(prev=>!prev);
    setOpen(open);
  }
  const mining=(_i, _j)=>{
    let node=document.querySelector(`.button_${_i}_${_j}`);
    _i=Number(_i);
    _j=Number(_j);
    if(table[_i][_j].isOpen){
      return;
    }
    table[_i][_j].isOpen=true;
    map_clear--;
    if(table[_i][_j].bomb){
      node.setAttribute("style","background-color:#C56869");
      node.innerHTML=`<Image src=${bombIcon} w="27px" h="24px"/>` ;
      setLose(true);
      ModalOpen(true);
    }
    else{
      node.setAttribute("style","background-color:#CDC6C3");
      if(table[_i][_j].count>0){
        node.textContent=table[_i][_j].count;
      }
      else{
        for(let m=(_i-1);m<(_i+2);m++){
          for(let n=(_j-1);n<(_j+2);n++){
            if(m==_i && n==_j)continue;
            if(m>-1 && m<map_row && n>-1 && n<map_col)mining(m,n);
          }
        }
      }
    }
    if(map_clear<1){
      setLose(false);
      ModalOpen(true);
    }
    //console.log(node.dataset.signal)
  }
  const Area=(props)=>(
    table[props.i][props.j].isOpen ?(table[props.i][props.j].bomb?<Button w='100%' h="100%" borderRadius="0" bg='#C56869'><Image src={bombIcon} w="27px" h="24px"/></Button>: <Button w='100%' h="100%" borderRadius="0" bg='#CDC6C3'>{table[props.i][props.j].count}</Button>):<Button w='100%' h="100%" borderRadius="0" bg='white' className={`button_${props.i}_${props.j}`} onClick={()=>mining(props.i,props.j)}></Button>
  )
  
  return (
    <Stack minH="100vh" textAlign="center" bgColor="#8BA4B3" fontWeight="bold" alignItems="center">
      <Heading as="h1" size="xl" color="white" mt="9vh" mb="4vh">
        Minesweeper
      </Heading>
      <Flex justifyContent="center" fontSize="20px" mb="4vh">
        <Flex w="210px" h="70px" bgColor="#FCF7EC" borderRadius="20" justifyContent="space-evenly" mr="50px" alignItems="center" padding="10px">
          <Image src={timeIcon} h="45px" w="45px"/>
          <Text>Timer</Text>
          <Time game={restart}/>
          <Text>s</Text>
        </Flex>
        <Flex w="210px" h="70px" bgColor="#FCF7EC" borderRadius="20" justifyContent="space-evenly" ml="50px" alignItems="center" padding="10px">
          <Image src={bombIcon} w="50px" h="45px"/>
          <Text>Bombs</Text>
          <Text>20</Text>
        </Flex>
      </Flex>
      <Grid h="518px" w="800px" templateColumns='repeat(10, 1fr)' templateRows='repeat(10, 1fr)' gap="2px" bg="gray" mb="4vh">
        {table && table.map((row,i)=>row.map((col,j)=><Area i={i} j={j} key={i*10+j}/>))}
      </Grid>
      <Modal isOpen={isOpen}>
        <ModalOverlay/>
        <ModalContent mt="40vh" bg={lose?"#E9524D":"#FFD7DF"} boxShadow='dark-lg' textAlign="center" maxW="60vw">
          <ModalHeader className="header" fontSize="xx-large" margin="4vh">{lose?"Game over!!!":"You win!!!"}</ModalHeader>
          <ModalBody fontSize="large">{lose?'Press "try again" button to play!':'Press "start" button to play again!'}</ModalBody>
          <ModalFooter>
            <Button onClick={()=>{ModalOpen(false)}}>{lose?"try again":"start"}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Stack>
    
    
  );
}

export default App;
