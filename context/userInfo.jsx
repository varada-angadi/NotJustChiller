// hooks/useUserInfo.js
import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth} from '../hooks/useAuth';

const UserInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsername = async () => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUsername(data.name || '');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, [user]);

  return (
    <UserInfoContext.Provider value={{ username, setUsername }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => useContext(UserInfoContext);
