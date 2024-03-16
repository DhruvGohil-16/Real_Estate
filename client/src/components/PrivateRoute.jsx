import { useSelector } from "react-redux" 
import { Outlet,Navigate } from "react-router-dom"
import {useToast} from '@chakra-ui/react'
import { useEffect } from "react";

export default function PrivateRoute({ from }) {
  const toast = useToast();
  const { currentUser } = useSelector((state) => state.user);

  // Display toast message based on the source URL
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: `Please login first to access ${from}`,
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
    }
  }, [from, toast]);

  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to='/' />
  );
}
