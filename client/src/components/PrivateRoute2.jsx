import { useSelector } from "react-redux" 
import { Outlet,Navigate } from "react-router-dom"
import {useToast} from '@chakra-ui/react'
import { useEffect } from "react";

export default function PrivateRoute2({ from }) {
  const toast = useToast();
  const { currentUser,role } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser || role!=='agent') {
      console.log(currentUser);
      toast({
        title: `Please login as agent first to access ${from}`,
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
    }
  }, [from, toast]);

  return (currentUser && role==='agent') ? 
    (<Outlet/>)
      :
    (<Navigate to='/' />);
}