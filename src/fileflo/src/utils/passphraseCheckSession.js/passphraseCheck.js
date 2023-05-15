import React, { useState, useEffect } from 'react';
import { getUser } from '../../../service/AuthService';
import axios from 'axios';

const checkPassphraseExists = async (passphrase) => {
  const [passphrase, setPassphrase] = useState('');
  const [passphraseEntered, setPassphraseEntered] = useState(false);

  const user = getUser();
  const sessionPassphrase = sessionStorage.getItem('personalPassphrase');

  useEffect(() => {
    if (sessionPassphrase !== null) {
      console.log('not null');
      setPassphrase(sessionPassphrase);
      setPassphraseEntered(true);
    } else {
      setPassphrase('');
      setPassphraseEntered(false);
    }
  }, []);

  return passphraseEntered;
};

export { checkPassphraseExists };
