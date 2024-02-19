import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Signup from '../pages/SignUp';
import SignUp from '../pages/SignUp';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function MyModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button className='p-3 ml-1 ty:hidden md:inline pb-3 bg-black text-white px-4 py-2 rounded-3xl hover:bg-slate-700 cursor-pointer' onClick={handleOpen}>Sign-up</button>
      <Modal
        open={open}
        onClose={handleClose}
      >
    
        <div className='ty:fixed df:static '>
            <div className='flex items-center justify-center'>
                <SignUp/>
            </div>
        </div>
      </Modal>
    </div>
  );
}