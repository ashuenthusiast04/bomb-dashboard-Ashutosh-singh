import {useEffect, useState} from 'react';
import useBombFinance from './useBombFinance';
import {BigNumber} from 'ethers';
import useRefresh from './useRefresh';

const  useLastEpoch = () => {
  const [lastEpoch, setLastEpoch] = useState<BigNumber>(BigNumber.from(0));
  const bombFinance = useBombFinance();
  const {slowRefresh} = useRefresh();

  useEffect(() => {
    async function fetchlastEpoch() {
      try {
        setLastEpoch(await bombFinance.getLastEpoch());
      } catch (err) {
        console.error(err);
      }
    }
    fetchlastEpoch();
  }, [setLastEpoch, bombFinance, slowRefresh]);

  return lastEpoch;
};

export default useLastEpoch;