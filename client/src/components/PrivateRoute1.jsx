import { useSelector } from "react-redux" 
import { Outlet,Navigate } from "react-router-dom"
import {useToast} from '@chakra-ui/react'
import { useEffect } from "react";

export default function PrivateRoute1({ from }) {
  const toast = useToast();
  const { currentUser,role } = useSelector((state) => state.user);

  // Display toast message based on the source URL
  useEffect(() => {
    console.log("private route called");
    if (!currentUser || role==='agent') {
      console.log(currentUser);
      toast({
        title: `Please login as user first to access ${from}`,
        status: 'success',
        duration: 4000,
        position: 'top',
        isClosable: true,
      });
    }
  }, [from, toast]);

  return (currentUser ? 
    (role === 'user' ? 
      (<Outlet/>) 
      : 
      (<Navigate to='/agent-dashboard' />)
      )
    : 
    (<Navigate to='/'/>)
  );
}
