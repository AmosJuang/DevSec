import { AppBar, Toolbar, Typography, InputBase, IconButton, Select, MenuItem, Button, Drawer, List, ListItem, ListItemText, ListItemIcon, Box, Fade, Grow, Zoom } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import MovieIcon from "@mui/icons-material/Movie";
import TvIcon from "@mui/icons-material/Tv";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PeopleIcon from "@mui/icons-material/People";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ForumIcon from "@mui/icons-material/Forum";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { alpha } from "@mui/material/styles";

const Navbar = () => {
    const [language, setLanguage] = useState("en");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    // Deteksi scroll untuk efek perubahan navbar
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Check authentication status
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            if (token) {
                setIsAuthenticated(true);
                setUserEmail(email || '');
            }
        };
        checkAuth();
    }, []);

    const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
    };

    const handleSignInClick = () => {
        navigate("/signin");
    };
    
    const handleBookmarkInClick = () => {
        navigate("/bookmark");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate({
                pathname: '/search',
                search: `?q=${encodeURIComponent(searchQuery.trim())}`
            });
            setSearchQuery('');
            setShowSearch(false);
        }
    };

    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    const handleProfileClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setIsAuthenticated(false);
        setAnchorEl(null);
        navigate('/signin');
    };

    const handleProfileNavigate = () => {
        navigate('/profile');
        setAnchorEl(null);
    };

    // Menu items dengan ikon
    const menuItems = [
        { text: "Movies", icon: <MovieIcon /> },
        { text: "TV Shows", icon: <TvIcon /> },
        { text: "Watch", icon: <PlayArrowIcon /> },
        { text: "Celebs", icon: <PeopleIcon /> },
        { text: "Awards & Events", icon: <EmojiEventsIcon /> },
        { text: "Community", icon: <ForumIcon /> },
        { text: "Profile", icon: <AccountCircleIcon /> },
        { text: "Settings", icon: <SettingsIcon /> },
    ];

    return (
        <>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: scrolled ? "rgba(18, 18, 18, 0.95)" : "#121212",
                    boxShadow: scrolled ? 3 : 0,
                    transition: "all 0.3s ease-in-out",
                    padding: scrolled ? "5px 0" : "10px 0"
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Zoom in={true} timeout={800}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: "bold",
                                    color: "#E50914",
                                    marginRight: "20px",
                                    fontFamily: "'Montserrat', sans-serif",
                                    letterSpacing: "0.5px",
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        cursor: "pointer"
                                    }
                                }}
                                onClick={() => navigate("/")}
                            >
                                RealRate
                            </Typography>
                        </Zoom>

                        <Grow in={true} timeout={600}>
                            <IconButton
                                color="inherit"
                                onClick={() => setIsDrawerOpen(true)}
                                sx={{
                                    transition: "transform 0.2s ease",
                                    "&:hover": {
                                        transform: "rotate(90deg)"
                                    }
                                }}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Grow>
                    </Box>

                    {/* Search Bar with Animation */}
                    <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center", mx: 2 }}>
                        <Fade in={showSearch} timeout={500}>
                            <Box sx={{ display: showSearch ? "block" : "none", width: "100%", maxWidth: "600px" }}>
                                <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
                                    <InputBase
                                        placeholder="Search movies..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        autoFocus={showSearch}
                                        sx={{
                                            backgroundColor: alpha("#fff", 0.15),
                                            borderRadius: "20px 0 0 20px",
                                            padding: "8px 15px",
                                            flexGrow: 1,
                                            color: "white",
                                            '&::placeholder': {
                                                color: alpha("#fff", 0.7),
                                            },
                                            transition: "all 0.3s ease",
                                            boxShadow: "0 0 10px rgba(245, 197, 24, 0.1)",
                                            "&:hover, &:focus": {
                                                backgroundColor: alpha("#fff", 0.25),
                                            }
                                        }}
                                    />
                                    <IconButton
                                        type="submit"
                                        sx={{
                                            backgroundColor: "#E50914",
                                            borderRadius: "0 20px 20px 0",
                                            padding: "8px",
                                            color: "#121212",
                                            "&:hover": {
                                                backgroundColor: "#e0b410"
                                            }
                                        }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </form>
                            </Box>
                        </Fade>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Zoom in={true} timeout={1000}>
                            <IconButton
                                color="inherit"
                                onClick={toggleSearch}
                                sx={{
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        color: "#E50914",
                                        transform: "scale(1.1)"
                                    }
                                }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Zoom>

                        <Zoom in={true} timeout={1200}>
                            <IconButton
                                color="inherit"
                                sx={{
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        color: "#E50914",
                                        transform: "scale(1.1)"
                                    }
                                }}
                                onClick={handleBookmarkInClick}
                            >
                                <BookmarkBorderIcon />
                            </IconButton>
                        </Zoom>

                        <Fade in={true} timeout={1400}>
                            <Select
                                value={language}
                                onChange={handleLanguageChange}
                                sx={{
                                    marginLeft: "15px",
                                    color: "white",
                                    backgroundColor: alpha("#333", 0.5),
                                    borderRadius: "15px",
                                    height: "40px",
                                    minWidth: "100px",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: alpha("#333", 0.8),
                                    },
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "transparent"
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "transparent"
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#E50914"
                                    }
                                }}
                            >
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Español</MenuItem>
                                <MenuItem value="fr">Français</MenuItem>
                                <MenuItem value="de">Deutsch</MenuItem>
                                <MenuItem value="zh">中文</MenuItem>
                                <MenuItem value="ja">日本語</MenuItem>
                                <MenuItem value="ko">한국어</MenuItem>
                                <MenuItem value="ru">Русский</MenuItem>
                                <MenuItem value="hi">हिन्दी</MenuItem>
                            </Select>
                        </Fade>

                        {isAuthenticated ? (
                            <>
                                <Grow in={true} timeout={1600}>
                                    <IconButton
                                        onClick={handleProfileClick}
                                        sx={{
                                            marginLeft: "20px",
                                            transition: "all 0.3s ease",
                                            "&:hover": {
                                                transform: "scale(1.1)",
                                            }
                                        }}
                                    >
                                        <Avatar 
                                            sx={{ 
                                                bgcolor: '#E50914',
                                                width: 35,
                                                height: 35,
                                            }}
                                        >
                                            {userEmail.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Grow>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleProfileClose}
                                    PaperProps={{
                                        sx: {
                                            backgroundColor: '#1e1e1e',
                                            color: 'white',
                                            mt: 1.5,
                                            '& .MuiMenuItem-root': {
                                                '&:hover': {
                                                    backgroundColor: alpha('#E50914', 0.15),
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem onClick={handleProfileNavigate}>
                                        <AccountCircleIcon sx={{ mr: 1 }} /> Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <LogoutIcon sx={{ mr: 1 }} /> Logout
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Grow in={true} timeout={1600}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        marginLeft: "20px",
                                        backgroundColor: "#E50914",
                                        color: "#121212",
                                        fontWeight: "bold",
                                        borderRadius: "20px",
                                        padding: "8px 20px",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            backgroundColor: "#E50914",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 6px 12px rgba(0,0,0,0.4)"
                                        },
                                        "&:active": {
                                            transform: "translateY(0)",
                                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
                                        }
                                    }}
                                    onClick={handleSignInClick}
                                >
                                    Sign In
                                </Button>
                            </Grow>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            {/* Spacer untuk kompensasi AppBar fixed */}
            <Toolbar sx={{ marginBottom: "20px" }} />

            {/* Drawer untuk Menu dengan Animasi */}
            <Drawer
                anchor="left"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#1e1e1e",
                        color: "#fff",
                        width: 280
                    }
                }}
            >
                <Box sx={{
                    width: 280,
                    paddingTop: "20px",
                    background: "linear-gradient(180deg, #121212 0%, #1e1e1e 100%)"
                }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            color: "#E50914",
                            textAlign: "center",
                            marginBottom: "30px",
                            fontFamily: "'Montserrat', sans-serif",
                        }}
                    >
                        RealRate
                    </Typography>

                    <List>
                        {menuItems.map((item, index) => (
                            <Fade
                                in={true}
                                key={item.text}
                                timeout={500 + (index * 100)}
                            >
                                <ListItem
                                    button
                                    sx={{
                                        margin: "8px 16px",
                                        borderRadius: "10px",
                                        transition: "all 0.2s ease",
                                        "&:hover": {
                                            backgroundColor: alpha("#E50914", 0.15),
                                            transform: "translateX(5px)"
                                        }
                                    }}
                                >
                                    <ListItemIcon sx={{ color: "#E50914", minWidth: "40px" }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            "& .MuiTypography-root": {
                                                fontWeight: 500
                                            }
                                        }}
                                    />
                                </ListItem>
                            </Fade>
                        ))}
                    </List>

                    <Box sx={{ padding: "20px", marginTop: "20px", textAlign: "center" }}>
                        <Button
                            variant="outlined"
                            sx={{
                                color: "#E50914",
                                borderColor: "#E50914",
                                "&:hover": {
                                    borderColor: "#E50914",
                                    backgroundColor: alpha("#E50914", 0.1)
                                }
                            }}
                            onClick={() => setIsDrawerOpen(false)}
                        >
                            Close Menu
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;