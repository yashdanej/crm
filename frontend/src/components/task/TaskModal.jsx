import * as React from 'react';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';

export default function TaskModal({ open, setOpen }) {
  return (
    <React.Fragment>
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
            bgcolor: 'background.body',
          }}
        >
          <ModalClose
            variant="plain"
            sx={{ m: 1 }}
            onClick={() => setOpen(false)}
          />
          <Typography
            component="h2"
            id="modal-title"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={2}
          >
            Terms of Service
          </Typography>
          <hr className='py-3' />
          <Typography
            id="modal-desc"
            textColor="text.secondary"
            mb={3}
          >
            With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world are updating their terms of service agreements to comply.
          </Typography>
          <Typography
            id="modal-desc"
            textColor="text.secondary"
            mb={3}
          >
            The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that could personally affect them.
          </Typography>
          <div>
            <Button
              sx={{ mr: 1 }}
              onClick={() => setOpen(false)}
            >
              I accept
            </Button>
            <Button
              variant="outlined"
              onClick={() => setOpen(false)}
            >
              Decline
            </Button>
          </div>
        </Sheet>
      </Modal>
    </React.Fragment>
  );
}
