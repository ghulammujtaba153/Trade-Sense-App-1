import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { API_URL } from '@/configs/url';
import { toast } from 'react-toastify';
import ReactApexChart from 'react-apexcharts';
import { Card, CardHeader, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const TradingGraph = () => {
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({ series: [], options: {} });

    const fetchData = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/trading-form/graph/6853b8d8db9a55c298462b64`);
            if (res.data.success && res.data.data) {
                const rawData = res.data.data;
                setData(rawData);
                prepareChartData(rawData);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to fetch trading data');
        } finally {
            setLoading(false);
        }
    };

    const prepareChartData = (rawData) => {
        const sortedData = [...rawData].sort((a, b) => new Date(a.date) - new Date(b.date));

        let cumulativeAmount = 0;
        const cumulativeData = sortedData.map(item => {
            cumulativeAmount += item.amount;
            return {
                x: new Date(item.date).getTime(),
                y: parseFloat(cumulativeAmount.toFixed(2))
            };
        });

        const dailyData = sortedData.map(item => ({
            x: new Date(item.date).getTime(),
            y: parseFloat(item.amount.toFixed(2))
        }));

        const labelColor = isDark ? '#ffffff' : '#000000';
        const gridColor = isDark ? '#424242' : '#e0e0e0';
        const tooltipBg = isDark ? '#2e2e2e' : '#ffffff';
        
        // Colors that work well in both modes
        const lineColors = isDark ? ['#00E396', '#FF4560'] : ['#008FFB', '#F44336'];

        const options = {
            chart: {
                type: 'line',
                height: 400,
                zoom: { enabled: true },
                toolbar: { show: true },
                background: 'transparent',
                foreColor: labelColor
            },
            title: {
                text: 'Trading Performance',
                align: 'left',
                style: {
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: labelColor
                }
            },
            stroke: {
                width: [4, 3],  // Increased stroke width for better visibility
                curve: 'smooth'
            },
            colors: lineColors,
            xaxis: {
                type: 'datetime',
                title: {
                    text: 'Date',
                    style: { color: labelColor }
                },
                labels: {
                    style: { colors: labelColor },
                    datetimeFormatter: {
                        year: 'yyyy',
                        month: "MMM 'yy",
                        day: 'dd MMM'
                    }
                },
                axisBorder: { color: gridColor },
                axisTicks: { color: gridColor },
            },
            yaxis: {
                title: {
                    text: 'Amount ($)',
                    style: { color: labelColor }
                },
                labels: {
                    style: { colors: labelColor },
                    formatter: val => val ? val.toFixed(2) : '0.00'
                }
            },
            tooltip: {
                theme: isDark ? 'dark' : 'light',
                shared: true,
                intersect: false,
                x: { format: 'dd MMM yyyy' },
                y: {
                    formatter: val => `$${val.toFixed(2)}`
                },
                style: {
                    fontSize: '14px'
                }
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                labels: {
                    colors: labelColor,
                    useSeriesColors: false
                },
                markers: {
                    width: 12,
                    height: 12,
                    radius: 0
                }
            },
            grid: {
                show: true,
                borderColor: gridColor,
                strokeDashArray: 5,
                position: 'back',
                xaxis: {
                    lines: {
                        show: true
                    }
                },
                yaxis: {
                    lines: {
                        show: true
                    }
                }
            },
            markers: {
                size: 5,
                hover: { 
                    size: 7,
                    sizeOffset: 2
                }
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                opacity: 1
            }
        };

        const series = [
            { 
                name: 'Cumulative P&L', 
                data: cumulativeData 
            },
            { 
                name: 'Daily P&L', 
                data: dailyData 
            }
        ];

        setChartData({ series, options });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) prepareChartData(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme.palette.mode]);

    // Stats
    const totalPnL = data.reduce((sum, item) => sum + item.amount, 0);
    const winningTrades = data.filter(item => item.amount > 0).length;
    const losingTrades = data.filter(item => item.amount < 0).length;
    const totalTrades = winningTrades + losingTrades;
    const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : 0;

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Typography>Loading trading data...</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader 
                title="Trading Performance Analysis"
                subheader={`Total Trades: ${data.length} | Win Rate: ${winRate}%`}
            />
            <CardContent>
                <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                    <Card variant="outlined" sx={{ minWidth: 120, p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Total P&L</Typography>
                        <Typography variant="h6" color={totalPnL >= 0 ? 'success.main' : 'error.main'}>
                            ${totalPnL.toFixed(2)}
                        </Typography>
                    </Card>
                    <Card variant="outlined" sx={{ minWidth: 120, p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Winning Trades</Typography>
                        <Typography variant="h6" color="success.main">{winningTrades}</Typography>
                    </Card>
                    <Card variant="outlined" sx={{ minWidth: 120, p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Losing Trades</Typography>
                        <Typography variant="h6" color="error.main">{losingTrades}</Typography>
                    </Card>
                    <Card variant="outlined" sx={{ minWidth: 120, p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Win Rate</Typography>
                        <Typography variant="h6">{winRate}%</Typography>
                    </Card>
                </Box>

                {chartData.series.length > 0 ? (
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="line"
                        height={400}
                    />
                ) : (
                    <Typography>No trading data available</Typography>
                )}
            </CardContent>
        </Card>
    )
}

export default TradingGraph;