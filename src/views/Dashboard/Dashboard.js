import React, { useMemo, useState } from 'react';
import Page from '../../components/Page';
import { Box, Button,  CardContent, Grid, Paper, Table, Typography } from '@material-ui/core';
// import { DataGrid } from '@mui/x-data-grid';
import HomeImage from '../../assets/img/background.jpg';
import { createGlobalStyle } from 'styled-components';
import BombImage from '../../assets/img/bomb.png';
import CountUp from 'react-countup';
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
const Title = styled.h2`
  margin: 1rem 0 0 0;
  text-align: center;
`;




const Dashboard = () => {
  
  const TVL = useTotalValueLocked();
  const currentEpoch = useCurrentEpoch();
  const { to } = useTreasuryAllocationTimes();
  const bombStats = useBombStats();
  const bShareStats = usebShareStats();
  const tBondStats = useBondStats();
  const stakedBalance = useStakedBalanceOnBoardroom();
  const totalStaked = useTotalStakedOnBoardroom();
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);
  const bSharePriceInBNB = useMemo(
    () => (bShareStats ? Number(bShareStats.tokenInFtm).toFixed(4) : null),
    [bShareStats],
  );
  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const tBondPriceInBNB = useMemo(() => (tBondStats ? Number(tBondStats.tokenInFtm).toFixed(4) : null), [tBondStats]);
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
          <td> {bombPriceInBNB ? bombPriceInBNB : '-.----'} BTC</td>
          <td>{roundAndFormatNumber(bombTotalSupply, 2)}</td>
          <td><TokenSymbol symbol='META' size={28}/></td>
        </tr>
        <tr>
          <td>$BSHARE</td>
          <td> {bSharePriceInBNB ? bSharePriceInBNB : '-.----'} BNB</td>
          <td>{roundAndFormatNumber(bShareTotalSupply, 2)}</td>
          <td><TokenSymbol symbol='META' size={28}/></td>

        </tr>
        <tr>
          <td>$BBOND</td>
          <td> {tBondPriceInBNB ? tBondPriceInBNB : '-.----'} BTC</td>
          <td>{roundAndFormatNumber(tBondTotalSupply, 2)}</td>
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
    <h5>Live TWAP: 1.17</h5>
    <h5>TVL: <CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" /></h5>
    <h5>Last Epoch TWAP: 1.22
    </h5>
  
          
  </div>
    
            </Box>
          </Card>
        </Grid>
        
        <Button className='button'style={{width:'59%'}}>
                  Zap In
                </Button>
                <Grid container rowSpacing={1} >
                <Grid item xs={8}>
                
                  
                <Button className='button1' style={{width:'49%',marginTop:'30px',marginRight:'5px'}}>
                  Chat On Discord
                </Button>
                <Button className='button1' style={{width:'49%',marginTop:'30px'}}>
                  Read Docs
                </Button>
          <Card>
            
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
               2% <br />
           
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
1660.4413      <br />
≈ $298.88
              </span>
  </Grid>
  <Grid item xs={4}>
 <Button className='button1' style={{width:'100px',marginTop:'0px',marginRight:'5px'}}>
                  Deposit
                </Button>
                <Button className='button1' style={{width:'100px',marginTop:'0px'}}>
                  Withdraw
                </Button>
                 <Button className='button1' style={{width:'200px',marginTop:'10px'}}>
                  Claim Rewards
                </Button>
  </Grid>
</Grid>
           </div>

            
          </Card>

         <Grid item xs={4}>
          <Card>KFSL</Card>
          </Grid>
         </Grid>
       
         
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
            TVL:$<CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
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
               2% <br />
           
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
1660.4413      <br />
≈ $298.88
              </span>
  </Grid>
  </Grid>

          <div style={{display:"flex", alignItems:"flex-end"}}>
            {/* href={buyBombAddress} */}
            <button  style={{ margin: '5px',padding:"6px 24px 6px 8px",borderRadius:"16px",background:"none",color:"white",border:" 2px solid white" }}>
              Deposit
            </button>
            {/* href={buyBombAddress} */}
            <button  style={{ margin: '5px',padding:"6px 24px 6px 8px",borderRadius:"16px",background:"none",color:"white",border:" 2px solid white"  }}>
              Withdraw
            </button>
            {/* href={buyBombAddress} */}
            <button  style={{ margin: '5px',padding:"6px 24px 6px 8px",borderRadius:"16px",background:"none",color:"white",border:" 2px solid white" }}>
              Claim Rewards
            </button>
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
            TVL:$<CountUp style={{ fontSize: '25px' }} end={TVL} separator="," prefix="$" />
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
               2% <br />
           
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
1660.4413      <br />
≈ $298.88
              </span>
  </Grid>
  </Grid>

          <div style={{display:"flex", alignItems:"flex-end"}}>
            {/* href={buyBombAddress} */}
            <button  style={{ margin: '5px',padding:"6px 24px 6px 8px",borderRadius:"16px",background:"none",color:"white",border:" 2px solid white" }}>
              Deposit
            </button>
            {/* href={buyBombAddress} */}
            <button  style={{ margin: '5px',padding:"6px 24px 6px 8px",borderRadius:"16px",background:"none",color:"white",border:" 2px solid white"  }}>
              Withdraw
            </button>
            {/* href={buyBombAddress} */}
            <button  style={{ margin: '5px',padding:"6px 24px 6px 8px",borderRadius:"16px",background:"none",color:"white",border:" 2px solid white" }}>
              Claim Rewards
            </button>
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
  BBond = 6.2872 BTCB <br />
           
              </span>
  </Grid>
  <Grid item xs={4}>
  <span style={{fontSize: '20px'}}>
  Available to redeem:  <br />
  456    <br />
             ≈ $1171.62
              </span>
  </Grid>
  
  <Grid item xs={4}>
  <span style={{fontSize: '20px'}}>
  Available to redeem:  <br />
  456   </span>
  <span>
   <Button className='button2' style={{width:'100px',marginTop:'-10px',marginLeft:'200px'}}>
                  Purchase
                </Button>
          <hr />
          Redeem Bomb
          <Button className='button2' style={{width:'100px',marginTop:'-10px',marginLeft:'240px'}}>
                  Redeem
                </Button>
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
</Page>

);

};

export default Dashboard;