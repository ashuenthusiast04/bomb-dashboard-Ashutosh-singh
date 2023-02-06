import React, { useMemo,useCallback } from 'react';
import Page from '../../components/Page';
import {useHistory} from 'react-router-dom';
import { Box, Button,  CardContent, Grid,  Typography } from '@material-ui/core';
// import { DataGrid } from '@mui/x-data-grid';
import HomeImage from '../../assets/img/background.jpg';
import { createGlobalStyle } from 'styled-components';
import BombImage from '../../assets/img/bomb.png';
import CountUp from 'react-countup';
import Footer from '../../components/Footer';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import moment from 'moment';
import { roundAndFormatNumber } from '../../0x';
import useBombStats from '../../hooks/useBombStats';
import usebShareStats from '../../hooks/usebShareStats';
import useBondStats from '../../hooks/useBondStats';
import './Dashboard.css';
import TokenSymbol from '../../components/TokenSymbol';
import styled from 'styled-components';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useEarnings from '../../hooks/useEarnings';
import useHarvest from '../../hooks/useHarvest';
import useShareStats from '../../hooks/usebShareStats';
import useStatsForPool from '../../hooks/useStatsForPool';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import Buttoncomp from './Button-comp';
import Bank from '../../bomb-finance';
import TVL from '../../bomb-finance/BombFinance';
import { Token } from 'graphql';
import ExchangeCard from '../Bond/components/ExchangeCard';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';
import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBondsPurchasable from '../../hooks/useBondsPurchasable';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { BOND_REDEEM_PRICE,BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import useApprove,{ApprovalState} from '../../hooks/useApprove';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import bombFinance from '../../bomb-finance';
import useBombFinance from '../../hooks/useBombFinance';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;
const Container = styled.div`
  background-image: url('./background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
`;
const Card = styled.div`
  color: white !important;
  width: 100%;
  margin: auto;
  margin-top:1rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(6px);
  border-radius: 25px;
  border: 2px solid rgba(114, 140, 223, 1);
  padding: 1rem;
  background-color: rgba(35, 40, 75, 0.75);
`;



// interface HarvestProps {
//   bank: Bank;
// }

// const Harvest: React.FC<HarvestProps> = ({bank}) => {
//   const earnings = useEarnings(bank.contract, bank.earnTokenName, bank.poolId);
//   const {onReward} = useHarvest(bank);
//   const bombStats = useBombStats();
//   const tShareStats = useShareStats();

//   const tokenName = bank.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
//   const tokenStats = bank.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
//   const tokenPriceInDollars = useMemo(
//     () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
//     [tokenStats],
//   );
//   const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
// };

const Dashboard = () => {
  const history= useHistory();
  const TVL = useTotalValueLocked();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const bombFinance = useBombFinance();
  const totalStaked = useTotalStakedOnBoardroom();
  const cashPrice= useCashPriceInLastTWAP();

  const cashStat= useCashPriceInEstimatedTWAP();
  const addTransaction =useTransactionAdder();
  const bondsPurchasable= useBondsPurchasable();
  const bondBalance= useTokenBalance(bombFinance?.BBOND);
  const {onReward} =useHarvest(Bank);
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);

  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);
 
  const isBondPurchasable = useMemo(() => Number(tBondStats?.tokenInFtm) < 1.01, [tBondStats]);
const { onRedeem } = useRedeemOnBoardroom();
  const canWithdraw = useWithdrawCheck();

  const liveEpochValue = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);

  const tokenName = Bank.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
  const canClaimReward= useClaimRewardCheck();

   
  // const earnings = useEarnings(Bank.contract, Bank.earnTokenName, Bank.poolId);
  // const tokenName = Bank.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
  //   const tokenStats = Bank.earnTokenName === 'BSHARE' ? bShareStats : bombStats;
  //   const tokenPriceInDollars = useMemo(
  //     () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
  //     [tokenStats]);
  // const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  const earnings = useEarnings(Bank.contract, Bank.earnTokenName, Bank.poolId);
  // const {onReward} = useHarvest(Bank);

 
  const tShareStats = useShareStats();
  const boardroomAPR = useFetchBoardroomAPR();

  // const tokenName = Bank.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
  const tokenStats = Bank.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );
  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bShareCirculatingSupply = useMemo(
    () => (bShareStats ? String(bShareStats.circulatingSupply) : null),
    [bShareStats],
  );
  // const tBondCirculatingSupply = useMemo(
  //   () => (tBondStats ? String(tBondStats.circulatingSupply) : null),
  //   [tBondStats],
  // );
  let statsOnPool = useStatsForPool(Bank);

  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
  const handleBuyBonds = useCallback(
    async (amount) => {
      const tx = await bombFinance?.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );
  const [approveStatus, approve] = useApprove(bombFinance.BSHARE, bombFinance.contracts.Boardroom.address);

  const handleRedeemBonds = useCallback(
    async (amount) => {
      const tx = await bombFinance?.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );
  // let lastEpochValue = 0;
  // useEffect(() => {
  //   lastEpochValue = liveEpochValue;
  // }, [currentEpoch]);
return(
<Page>
<BackgroundImage />
<Grid item xs={12} sm={12}>
          <Card>
            <div >
              <h1  className='head'>Bomb Finance Summary</h1>
              <hr style={{opacity:'0.2'}}/>
            
            </div>
          <div >
            <div className='column'>
            <img src={BombImage} alt="Bomb.money" style={{ maxHeight: '20px',float:'left',marginTop:'60px',marginRight:'-30px' }} />
            <img src={BombImage} alt="Bomb.money" style={{ maxHeight: '20px',float:'left',marginTop:'120px' }} />
            <img src={BombImage} alt="Bomb.money" style={{ maxHeight: '20px',float:'left',marginTop:'160px',marginLeft:'-15px' }} />
      <table>
        <tr>
          <th> </th>
          <th>Current Supply</th>
          <th>Total Supply</th>
          <th>Price</th>
         
        </tr>
        
        <tr>
      
          <td>$BOMB</td>
          <td> {roundAndFormatNumber(bombCirculatingSupply, 2)} BTC</td>
          <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
          <td> {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC</td>
          <td><TokenSymbol symbol='META' size={28}/></td>
        </tr>
        <tr>
          <td>$BSHARE</td>
          <td> {roundAndFormatNumber(bShareCirculatingSupply, 2)} BNB</td>
          <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
          <td> {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB</td>
          <td><TokenSymbol symbol='META' size={28}/></td>

        </tr>
        <tr>
          <td>$BBOND</td>
          <td> {roundAndFormatNumber(bShareCirculatingSupply, 2)} BTC</td>
          <td>{roundAndFormatNumber(tBondTotalSupply, 2)}</td>
          <td> {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC</td>

          <td><TokenSymbol symbol='META' size={28}/></td>

        </tr>
      </table>
      </div>
      </div>
    
            <Box p={4} style={{ textAlign: 'center' }}>
           
  <div className='tab'>
    <h3>CURRENT EPOCH</h3>
    <h1>{Number(currentEpoch)}</h1>
    <hr  style={{opacity:'0.2'}} />
    <h1>  <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" /></h1>
    <h3>Next EPOCH in</h3>
    <hr  style={{opacity:'0.2'}} />
    <h5>Live TWAP: {scalingFactor}</h5>
    <h5>TVL: <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" /></h5>
    <h5>Last Epoch TWAP: 1.22
    </h5>
  
          
  </div>
    
            </Box>
          </Card>
        </Grid>
        
       
                <Grid container rowSpacing={1}>
                {/* <Card style={{ float: 'right', width: '20%', marginRight: '2rem', marginLeft: '2px', height: '23rem' }}>
          <h2>Latest News</h2>
        </Card> */}
                <Grid item xs={8}>
                <span style={{marginLeft:'0rem',color:'rgba(0,245,171,0.5)'}}>
        <Button className='button'style={{width:'98%'}}>
                  Invest Now
                </Button>
               
                <Button className='button' style={{width:'48%',marginTop:'30px',marginLeft:'8px'}}>
                  Chat On Discord
                </Button>
                <Button className='button' style={{width:'49%',marginTop:'30px'}}>
                  Read Docs
                </Button></span>
                
               
          <Card style={{marginLeft:'0rem'}}>
            
          <img src={BombImage} alt="Bomb.money" style={{ maxHeight: '40px',float:'left',padding:'7px' }} />
          <div className='header'>
          <h3 >Boardroom</h3>
           <p>Stake BSHARE and earn BOMB every epoch&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TVL:  <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" /></p>
           

           <hr  style={{color:'white'}} />
           <Typography style={{marginLeft:'360px'}}>Total Staked:{getDisplayBalance(totalStaked)} <img src={BombImage} alt="Bomb.money" style={{ maxHeight: '20px',float:'left',marginTop:'0px' }} /></Typography>
         
              <Grid container rowSpacing={1} >
  <Grid item xs={2}>
  <span style={{ fontSize: '20px' }}>
                 Daily Returns<br />
                 {(boardroomAPR/365).toFixed(3)}% <br />
           
              </span>
  </Grid>
  <Grid item xs={3}>
  <span style={{fontSize: '20px'}}>
              Your Stake: <br />
            6.0000      <br />
             ≈ ${getDisplayBalance(stakedBalance)}
              </span>
  </Grid>
  <Grid item xs={3}>
  <span style={{fontSize: '20px'}}>
  Earned: 
 <br />
 {getDisplayBalance(earnings)}      <br />
≈ ${earnedInDollars}
              </span>
  </Grid>
  <Grid item xs={4}>
  <div
                style={{
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  borderRadius: '20px',
                  margin: '5px',
                }}
                disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                onClick={approve}
              >
                Deposit
                &emsp;
                    <TokenSymbol symbol="UP" size={16} />
              </div>
              <div
                style={{
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  borderRadius: '20px',
                  margin: '5px',
                }}
                disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
              >
                Withdraw
                &emsp;
                    <TokenSymbol symbol="DOWN" size={15} />
              
              </div>
              <div
                style={{
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  borderRadius: '20px',
                  margin: '5px',
                }}
                onClick={onReward}
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward
                &emsp;
                    <TokenSymbol symbol="BSHARE" size={16} />
              
              </div>
  </Grid>
</Grid>
           </div>

            
          </Card>

       
         </Grid>
         <Card style={{ float: 'right', width: '20%', marginLeft: '120px', height: '23rem' }}>
          <h2>Latest News</h2>
        </Card>
         
        </Grid>
        
       
        <Grid item xs={12} sm={12}>
        
        
          <Card>
        <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '20px', margin: '1px', padding: '1px' }}>
              Bomb Farms
              <br />
              <div style={{ fontSize: '14px', margin: '4px' }}>
                Stake your LP tokens in our farms to start earning $BSHARE
              </div>
              <br />
            </p>
          </div>
          <div style={{ border: '2px solid white', borderRadius: '16px', padding: '4px 32px' }}>Claim All</div>
        </div>
{/* Bomb btcb */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '20px', display: 'flex', alignContent: 'center', alignItems: 'center' }}>
            <TokenSymbol symbol="BOMB-BNB-LP" size={28} />
            <span style={{ padding: '4px' }}>BOMB-BTCB</span>
            <span
              style={{
                fontSize: '10px',
                background: 'rgba(0, 232, 162, 0.5)',
                padding: '2px',
                borderRadius: '5px',
                height: '12px',
              }}
            >
              Recommended
            </span>
          </div>
          <div style={{ fontSize: '20px', display: 'flex', alignContent: 'center', alignItems: 'center' }}>
            TVL:<CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
          </div>
        </div>
        <hr />

        <div style={{display:"flex", justifyContent:"space-between"}}>
          {/* <table style={{textAlign:"center",borderSpacing:"12px",width:"40%"}}>
            <th>Daily Returns:</th>
            <th>Your Stack</th>
            <th>Earned:</th>
            <tr>
              <td>2%</td>
              <td>124.21</td>
              <td>6.4413</td>
            </tr>
            <tr>
              <td></td>
              <td>≈ $1171.62</td>
              <td>≈ $298.88</td>
            </tr>
          </table> */}
                    <Grid container rowSpacing={1} >
  <Grid item xs={2}>
  <span style={{ fontSize: '20px' }}>
                 Daily Returns<br />
                 {(boardroomAPR/365).toFixed(2)}% <br />
           
              </span>
  </Grid>
  <Grid item xs={3}>
  <span style={{fontSize: '20px'}}>
              Your Stake: <br />
            6.0000      <br />
             ≈ ${getDisplayBalance(stakedBalance)}
              </span>
  </Grid>
  <Grid item xs={3}>
  <span style={{fontSize: '20px'}}>
  Earned: 
 <br />
 {getDisplayBalance(earnings)}     <br />
≈ {earnedInDollars}
              </span>
  </Grid>
  </Grid>

          <div style={{display:"flex", alignItems:"flex-end",justifyContent:'space-between'}}>
            {/* href={buyBombAddress} */}
            <div
                style={{
                  width:'100px',
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  borderRadius: '20px',
                  marginBottom: '5px',
                }}
                disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                onClick={approve}
              >
                Deposit
                &emsp;
                    <TokenSymbol symbol="UP" size={12} />
              </div>
              {/* href={buyBombAddress} */}
              <div
                style={{
                  width:'120px',
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  margin: '5px',
                  borderRadius: '20px',
                }}
                disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
              >
                Withdraw
                &emsp;
                    <TokenSymbol symbol="DOWN" size={12} />
              
              </div>
              {/* href={buyBombAddress} */}
              <div
                style={{
                  width:'150px',
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  margin: '5px',
                  borderRadius: '20px',
                }}
                onClick={onReward}
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward&emsp;
                    <TokenSymbol symbol="BSHARE" size={16} />
              
              </div>
          </div>
        </div>
        <hr style={{border:"1px solid rgba(0, 173, 232, 1)"}}/>


        {/* Bshare -bnb */}
        <div style={{ display: 'flex', justifyContent: 'space-between',marginTop:"28px" }}>
          <div style={{ fontSize: '20px', display: 'flex', alignContent: 'center', alignItems: 'center' }}>
            <TokenSymbol symbol="BOMB-BNB-LP" size={28} />
            <span style={{ padding: '4px' }}>BSHARE-BNB</span>
            <span
              style={{
                fontSize: '10px',
                background: 'rgba(0, 232, 162, 0.5)',
                padding: '2px',
                borderRadius: '5px',
                height: '12px',
              }}
            >
              Recommended
            </span>
          </div>
          <div style={{ fontSize: '20px', display: 'flex', alignContent: 'center', alignItems: 'center' }}>
            TVL:<CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
          </div>
        </div>
        <hr />

        <div style={{display:"flex", justifyContent:"space-between",padding:'5px'}}>
          {/* <table style={{textAlign:"center",borderSpacing:"12px", width:"40%"}}>
            <th>Daily Returns:</th>
            <th>Your Stack</th>
            <th>Earned:</th>
            <tr>
              <td>2%</td>
              <td>124.21</td>
              <td>6.4413</td>
            </tr>
            <tr>
              <td></td>
              <td>≈ $1171.62</td>
              <td>≈ $298.88</td>
            </tr>
          </table> */}
           <Grid container rowSpacing={1} >
  <Grid item xs={2}>
  <span style={{ fontSize: '20px' }}>
                 Daily Returns<br />
                 {(boardroomAPR/365).toFixed(2)}% <br />
           
              </span>
  </Grid>
  <Grid item xs={3}>
  <span style={{fontSize: '20px'}}>
              Your Stake: <br />
            6.0000      <br />
             ≈ ${getDisplayBalance(stakedBalance)}
              </span>
  </Grid>
  <Grid item xs={3}>
  <span style={{fontSize: '20px'}}>
  Earned: 
 <br />
 {getDisplayBalance(earnings)}     <br />

≈ ${earnedInDollars}
              </span>
  </Grid>
  </Grid>

          <div style={{display:"flex", alignItems:"flex-end"}}>
          <div
                style={{
                  width:'100px',
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  borderRadius: '20px',
                  marginBottom: '5px',
                }}
                disabled={approveStatus !== ApprovalState.NOT_APPROVED}
                onClick={approve}
              >
                Deposit
                &emsp;
                    <TokenSymbol symbol="UP" size={12} />
              </div>
              {/* href={buyBombAddress} */}
              <div
                style={{
                  width:'120px',
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  margin: '5px',
                  borderRadius: '20px',
                }}
                disabled={stakedBalance.eq(0) || (!canWithdraw && !canClaimReward)}
                onClick={onRedeem}
              >
                Withdraw
                &emsp;
                    <TokenSymbol symbol="DOWN" size={12} />
              
              </div>
              {/* href={buyBombAddress} */}
              <div
                style={{
                  width:'150px',
                  height: '20px',
                  color: 'white',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  border: '1px solid white',
                  padding: '5px 8px 5px 10px',
                  margin: '5px',
                  borderRadius: '20px',
                }}
                onClick={onReward}
                disabled={earnings.eq(0) || !canClaimReward}
              >
                Claim Reward&emsp;
                    <TokenSymbol symbol="BSHARE" size={16} />
              
              </div>
          </div>
        </div>


      </Card>
            
       
        </Grid>
        <Grid item xs={12} sm={12}>
        
        <Card>
              
        <img src={BombImage} alt="Bomb.money" style={{ maxHeight: '40px',float:'left',padding:'7px' }} />
          <div className='header'>
          <h3 >Bonds </h3>
           <p>BBOND can be purchased only on contraction periods, when TWAP of BOMB is below 1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TVL:  <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" /></p>
           

           <hr  style={{color:'white'}} />
          
              <Grid container rowSpacing={1} >
  <Grid item xs={4}>
  <span style={{ fontSize: '20px' }}>
  Current Price: (Bomb)^2<br />
  BBond = {Number(scalingFactor / 100000000000000)} BTCB <br />
           
              </span>
  </Grid>
  <Grid item xs={4}>
  <span style={{fontSize: '20px'}}>
  Available to redeem:  <br />
  456    <br />
              </span>
  </Grid>
  
  <Grid item xs={4}>
  <span style={{fontSize: '20px'}}>
  Available to redeem:  <br />
  456   </span>
  <span>
  <div
                  style={{
                    width:'120px',
                    height: '20px',
                    color: 'white',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    border: '1px solid white',
                    padding: '5px 8px 5px 10px',
                    borderRadius: '20px',
                  }}
                  onClick={handleBuyBonds}
                  disabled={!tBondStats || isBondRedeemable}
                >
                  Purchase
                  &emsp;
                    <TokenSymbol symbol="PURCHASE" size={16} />

                </div>
          <hr />
          Redeem Bomb
          <div
                  style={{
                    width:'120px',

                    height: '20px',
                    color: 'white',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    border: '1px solid white',
                    padding: '5px 8px 5px 10px',
                    borderRadius: '20px',
                  }}
                  onClick={handleRedeemBonds}
                  disabled={!tBondStats || bondBalance.eq(0) || !isBondRedeemable}
                >
                  Redeem
                  &emsp;
                    <TokenSymbol symbol="DOWN" size={16} />
              
                </div>
              </span>
 {/* <Button className='button1' style={{width:'100px',marginTop:'0px',marginRight:'5px'}}>
                  Deposit
                </Button>
                <Button className='button1' style={{width:'100px',marginTop:'0px'}}>
                  Withdraw
                </Button>
                 <Button className='button1' style={{width:'200px',marginTop:'10px'}}>
                  Claim Rewards
                </Button> */}
  </Grid>
  </Grid>
  </div>
          
        </Card>
      </Grid>
      {/* <Footer /> */}
</Page>

);

};

export default Dashboard;