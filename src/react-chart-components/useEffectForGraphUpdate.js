import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Icon, Table, TableContainer, TableRow, TableBody, TableCell, TableHead, FormControl, Select, MenuItem } from "@material-ui/core"
import { Link } from '@material-ui/core'
import openIcon from "../../assets/shape.svg"
import graph from "../../assets/Chart.png"
import "./NetPositions.css"
import { ExpandMore } from "@material-ui/icons"
import { connect } from "react-redux";
import { sortTrades, filterByBroker, resetFilteredTrades } from '../../redux/actions'
import moment from 'moment';
import { generateChart } from './NetObligationChart.js'

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: '80%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        fontSize: '14px',
        maxHeight: '100%',
        height: '100%'

    },
    paddingHeader: {
        paddingBottom: '-10px',
        fontSize: '14px',
        color: '#838383',
        backgroundColor: "white",
        position: "sticky",
        top: 0
    },
    header: {
        marginLeft: '10px',
        fontSize: '14px',
        color: '#838383',
        backgroundColor: "white",
        position: "sticky",
        top: 0
    },
    data: {
        fontSize: '14px',
        fontWeight: 'bold',
        paddingTop: 0,
        paddingBottom: 0,
        height: '40px',
        maxHeight: '45px'
    },
    grey: {
        backgroundColor: '#f4f6f8',
        fontSize: '14px',
        height: '40px',
        maxHeight: '40px'
    },
    white: {
        backgroundColor: 'white',
        fontSize: '14px',
        height: '40px',
        maxHeight: '40px'
    },
    cell: {
        fontSize: '14px'
    },
    expandIcon: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    icon: {
        color: '#2567c2', display: 'inline'
    },
    dropDown: {
        borderRadius: '3px',
    }
}));


function getModalStyle() {
    // this affects where the modal displays
    return {
        margin: `auto`,
        position: `relative`,
        top: "3%",
        maxHeight: "97%",
        fontSize: "14px"
    };
}



function SimpleModal({ dispatch, novatedTrades, ...props }) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);
    const [broker, setBroker] = React.useState("all");
    const [iconOn, setIconOn] = React.useState({
        "amount": false,
        "quantity": false,
        "price": false,
        "timestamp": false,
    });
    const chartRef = useRef(null);

    const handleOpen = () => {
        setOpen(true);
    };
    const trades = props.filteredNovatedTrades &&
        props.filteredNovatedTrades.length > 0 ? props.filteredNovatedTrades
        : novatedTrades[props.cusip];
    const userName = props.userName;

    useEffect(() => {
        if (open) {
            const timeOut = setTimeout(function () {
                generateChart(chartRef, [...trades], userName);
            }, 100);
            return (() => {
                clearTimeout(timeOut);
            });
        }
    }, [broker, open, JSON.stringify(trades), chartRef, userName]);



    const handleClose = () => {
        setOpen(false);
        dispatch(sortTrades('reset', novatedTrades[props.cusip]))
        setBroker("all")
        dispatch(resetFilteredTrades())
    };

    const formatCash = number => {
        var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        });
        return formatter.format(number);
    }

    const formatQuantity = number => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const formatTimeStamp = (timeStamp) => {
        if (timeStamp !== undefined) {
            //replace any forward slashes.
            timeStamp = timeStamp.replace(/\//g, '-');
            //convert timeStamp to EST
            let date = new Date(timeStamp);
            let estTime = (moment(date).utcOffset("0500").format('HH:mm:ss A'));
            return estTime;
        }
    }

    const handleBrokerChange = event => {
        setBroker(event.target.value);
        dispatch(filterByBroker(novatedTrades[props.cusip], event.target.value, props.userName));
    };

    const localSort = (prop) => {
        setIconOn({ ...iconOn, [prop]: !iconOn[prop] });
        let tradesToFilterAndOrSort = [];
        // sort subset of data, depending on if the broker-side filter is set
        if (broker === 'buy') {
            tradesToFilterAndOrSort = props.filteredNovatedTrades
        } else if (broker === 'sell') {
            tradesToFilterAndOrSort = props.filteredNovatedTrades
        } else {
            tradesToFilterAndOrSort = novatedTrades[props.cusip];
        }
        dispatch(sortTrades(prop, tradesToFilterAndOrSort, iconOn[prop]))
    }

    return (
        // Click this to open the modal. This displays on the dash when modal is closed
        <>
            <Link onClick={() => handleOpen()} style={{ textDecoration: 'underline', color: '#003956', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
                {props.cusip}
                <div style={{ height: '10px', display: 'inline', color: '#003956' }}>
                    <img src={openIcon} alt="open icon" style={{ height: '8px', width: '13px', verticalAlign: 'top' }} />
                </div>
            </Link>

            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >



                {/* When Modal is open, this displays */}
                <div style={modalStyle} className={classes.paper}>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginTop: '1%', minHeight: '100%' }}>
                        <div className="trades-title">
                            <h2 id="simple-modal-title">Trades</h2>
                            <Icon fontSize="large" onClick={() => handleClose()}>clear</Icon>
                        </div>

                        <div className="trades-info-heading">

                            <h2>{props.sym}/{props.cusip}</h2>
                            <h2>{new Date().toDateString() + " " + new Date().toLocaleTimeString()}</h2>

                        </div>

                        {/* Graph (static image currently) */}
                        <div style={{ display: 'flex' }} className="trades-graph">
                            <canvas
                                id="tradesChart"
                                ref={chartRef}
                            />
                        </div>


                        {/* Select dropdown for buy/sell broker */}
                        <div style={{ marginTop: '1%' }} className="novatedTradesDropDown">
                            <FormControl variant="outlined" className={classes.dropDown}>
                                <Select
                                    style={{
                                        height: '32px',
                                        backgroundColor: 'white',
                                    }}
                                    value={broker}
                                    onChange={e => handleBrokerChange(e)}
                                >
                                    <MenuItem value={'all'}>Broker Side</MenuItem>
                                    <MenuItem value={'buy'}>Buy Broker</MenuItem>
                                    <MenuItem value={'sell'}>Sell Broker</MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Trades table */}
                        <div className="trades" style={{ height: '10px', maxHeight: '260px', width: '100%', flexGrow: 1 }}>
                            <TableContainer style={{ borderBottom: 'none', maxHeight: '100%', fontWeight: 'bold', overflow: "scroll" }} >
                                <Table aria-label="simple-table" >
                                    <TableHead id="trades-table-head" >
                                        <TableRow className={classes.header}>
                                            <TableCell className={classes.header}>
                                                TRADE ID
                        </TableCell>
                                            <TableCell className={classes.header}>
                                                BUY BROKER
                        </TableCell>
                                            <TableCell className={classes.header} >
                                                SELL BROKER
                        </TableCell>
                                            <TableCell className={classes.header}>
                                                SYMBOL
                        </TableCell>
                                            <TableCell className={classes.header}>
                                                CUSIP
                        </TableCell>
                                            <TableCell className={classes.header}>
                                                <div className={classes.expandIcon}>
                                                    QUANTITY
                                <ExpandMore style={iconOn.quantity ? { transform: "rotate(180deg)" } : null} className="expandMoreIconNetOb" onClick={() => localSort('quantity')} />
                                                </div>
                                            </TableCell>
                                            <TableCell className={classes.header}>
                                                <div className={classes.expandIcon}>
                                                    PRICE <ExpandMore style={iconOn.price ? { transform: "rotate(180deg)" } : null} className="expandMoreIconNetOb" onClick={() => localSort('price')} />
                                                </div>
                                            </TableCell>
                                            <TableCell className={classes.header}>
                                                <div className={classes.expandIcon}>
                                                    VALUE <ExpandMore style={iconOn.amount ? { transform: "rotate(180deg)" } : null} className="expandMoreIconNetOb" onClick={() => localSort('amount')} />
                                                </div>
                                            </TableCell>
                                            <TableCell className={classes.paddingHeader} style={{ paddingTop: `-10px` }}>
                                                <div className={classes.expandIcon}>
                                                    TIMESTAMP <ExpandMore style={iconOn.timestamp ? { transform: "rotate(180deg)" } : null} className="expandMoreIconNetOb" onClick={() => localSort('timestamp')} />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    {
                                        /* if the data exists, map through it. else null (so no crash) */
                                        novatedTrades && novatedTrades[props.cusip] && Object.keys(novatedTrades).length !== 0 ?

                                            <TableBody id="trades-table-row" style={{ fontSize: '14px', borderBottom: 'none' }}>

                                                {/* filteredNovatedTrades - this displays when a user is filting any column. 
                          Maps through props.filteredNovatedTrades from Redux  */}
                                                {(props.filteredNovatedTrades.length > 0 || (broker === 'buy' || broker === 'sell')) ?
                                                    props.filteredNovatedTrades.map((trade, index) => (
                                                        <TableRow key={index} className={index % 2 ? classes.white : classes.grey} border={0}>
                                                            <TableCell className={classes.data}>{trade.tradeID}</TableCell>
                                                            <TableCell className={classes.data}>{trade.buyer}</TableCell>
                                                            <TableCell className={classes.data}>{trade.seller}</TableCell>
                                                            <TableCell className={classes.data}>{props.sym}</TableCell>
                                                            <TableCell className={classes.data}>{trade.cusip}</TableCell>
                                                            <TableCell className={classes.data} style={trade.seller === props.userName ? { color: '#db4432' } : null}>
                                                                {
                                                                    //if the user is on the sell-side, the quantity is negative
                                                                    trade.seller === props.userName ?
                                                                        "(-" + formatQuantity(trade.shareQty) + ")"
                                                                        :
                                                                        formatQuantity(trade.shareQty)
                                                                }
                                                            </TableCell>
                                                            <TableCell className={classes.data}>{formatCash(trade.unitPrice)}</TableCell>
                                                            <TableCell className={classes.data} style={trade.seller === props.userName ? null : { color: '#db4432' }}>
                                                                {
                                                                    trade.seller === props.userName ?
                                                                        formatCash(parseFloat(trade.amount))
                                                                        :

                                                                        '(' + formatCash(parseFloat(trade.amount)) + ")"
                                                                }
                                                            </TableCell>
                                                            <TableCell className={classes.data} >{formatTimeStamp(trade.timeStamp)}</TableCell>
                                                        </TableRow>
                                                    ))
                                                    :
                                                    /* not-filtered novated trades
                                                      Maps through regular (not filtered) novated trades */
                                                    novatedTrades[props.cusip].map((trade, index) => (
                                                        <TableRow key={index} className={index % 2 ? classes.white : classes.grey} border={0}>
                                                            <TableCell className={classes.data}>{trade.tradeID}</TableCell>
                                                            <TableCell className={classes.data}>{trade.buyer}</TableCell>
                                                            <TableCell className={classes.data}>{trade.seller}</TableCell>
                                                            <TableCell className={classes.data}>{props.sym}</TableCell>
                                                            <TableCell className={classes.data}>{trade.cusip}</TableCell>
                                                            <TableCell className={classes.data} style={trade.seller === props.userName ? { color: '#db4432' } : null}>
                                                                {
                                                                    //if the user is on the sell-side, the quantity is negative
                                                                    trade.seller === props.userName ?
                                                                        "(-" + formatQuantity(trade.shareQty) + ")"
                                                                        :
                                                                        formatQuantity(trade.shareQty)
                                                                }
                                                            </TableCell>
                                                            <TableCell className={classes.data}>{formatCash(trade.unitPrice)}</TableCell>
                                                            <TableCell className={classes.data} style={trade.seller === props.userName ? null : { color: '#db4432' }}>
                                                                {
                                                                    trade.seller === props.userName ?
                                                                        formatCash(parseFloat(trade.amount))
                                                                        :

                                                                        '(' + formatCash(parseFloat(trade.amount)) + ")"
                                                                }
                                                            </TableCell>
                                                            <TableCell className={classes.data} >{formatTimeStamp(trade.timeStamp)}</TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                            :
                                            null
                                    }
                                </Table>
                            </TableContainer>
                        </div>
                        <div id="simple-modal-description">
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

const mapStateToProps = state => ({
    filteredNovatedTrades: state.filteredNovatedTrades,
    sortedNovatedTrades: state.sortedNovatedTrades,
    userName: state.userName
})

export default connect(mapStateToProps, null)(SimpleModal);