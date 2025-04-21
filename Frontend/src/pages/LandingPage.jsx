// import { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   useTheme,
//   useMediaQuery,
//   LinearProgress,
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { keyframes } from "@emotion/react";

// // Keyframes for up-and-down animation
// const floatAnimation = keyframes`
//   0% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
//   100% { transform: translateY(0); }
// `;

// const LandingPage = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const navigate = useNavigate();

//   // State for progress loader
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (token && storedUser) {
//       navigate("/profile-complete"); // Redirect to invoices dashboard if logged in
//     }
//   }, [navigate]);

//   const handleButtonClick = (path) => {
//     setLoading(true);
//     setTimeout(() => {
//       navigate(path);
//     }, 200);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: isMobile ? "column" : "row",
//         alignItems: "center",
//         justifyContent: "center",
//         minHeight: "100vh",
//         padding: 4,
//         backgroundColor: "#f5f5f5",
//         overflow: "hidden",
//         position: "relative",
//       }}
//     >
//       {/* Progress Loader */}
//       {loading && (
//         <LinearProgress
//           sx={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             right: 0,
//             zIndex: 9999,
//             backgroundColor: "#00e68a",
//             "& .MuiLinearProgress-bar": {
//               backgroundColor: "#fff",
//             },
//           }}
//         />
//       )}

//       {/* Logo */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 16,
//           left: 16,
//           zIndex: 1,
//         }}
//       >
//         <Link to="/">
//           <img
//             src="/invoiceLogo.gif" // Update with your invoice system logo
//             alt="Invoice System Logo"
//             style={{
//               width: "70px",
//               height: "auto",
//               borderRadius: 50,
//             }}
//           />
//         </Link>
//       </Box>

//       {/* Left Section: Invoice-related Images */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           position: "relative",
//           marginRight: isMobile ? 0 : 4,
//           marginBottom: isMobile ? 4 : 0,
//         }}
//       >
//         {/* Main Invoice Image */}
//         <Box
//           sx={{
//             position: "relative",
//             width: "100%",
//             maxWidth: "600px",
//             marginTop: "10%",
//             animation: `${floatAnimation} 3s ease-in-out infinite`,
//           }}
//         >
//           <img
//             src="/LandingPageImage.jpg" // Dashboard screenshot
//             alt="Invoice Dashboard"
//             style={{
//               width: "100%",
//               height: "auto",
//               borderRadius: 16,
//               marginLeft: "-20%",
//               boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
//             }}
//           />

//           {/* Floating Invoice Examples */}
//           <Box
//             sx={{
//               position: "absolute",
//               top: "-55%",
//               right: "-30%",
//               width: "80%",
//               height: "80%",
//               transform: "translate(25%, -25%)",
//               animation: `${floatAnimation} 2s ease-in-out infinite`,
//             }}
//           >
//             {/* Sample Invoice 1 */}
//             <img
//               src="/Invoice1.jpg" // Sample invoice image
//               alt="Sample Invoice"
//               style={{
//                 width: "50%",
//                 height: "100%",
//                 borderRadius: 8,
//                 border: "1px solid #e0e0e0",
//               }}
//             />

//             {/* Sample Invoice 2 & 3 */}
//             <Box
//               sx={{
//                 position: "absolute",
//                 top: 0,
//                 right: 0,
//                 width: "50%",
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: 1,
//               }}
//             >
//               <img
//                 src="/Invoice2.jpg" // Another sample
//                 alt="Detailed Invoice"
//                 style={{
//                   width: "100%",
//                   height: "50%",
//                   borderRadius: 8,
//                   border: "1px solid #e0e0e0",
//                 }}
//               />
//             </Box>
//           </Box>
//         </Box>
//       </Box>

//       {/* Right Section: Buttons and Description */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           textAlign: "center",
//           maxWidth: "600px",
//         }}
//       >
//         <Typography
//           variant="h4"
//           sx={{
//             fontWeight: "bold",
//             marginBottom: 2,
//             zIndex: 1,
//           }}
//         >
//           Professional Invoice Generation System
//         </Typography>
//         <Typography
//           variant="body1"
//           sx={{ marginBottom: 4, color: "text.secondary" }}
//         >
//           Create, manage, and track invoices effortlessly. Our system offers:
//         </Typography>

//         {/* Features List */}
//         <Box
//           sx={{
//             textAlign: "left",
//             marginBottom: 4,
//             "& ul": {
//               paddingLeft: 2,
//             },
//             "& li": {
//               marginBottom: 1,
//             },
//           }}
//         >
//           <ul style={{ listStyleType: "circle" }}>
//             <li>Automated invoice generation</li>
//             <li>Customizable templates</li>
//             <li>Client management</li>
//             <li>Payment tracking</li>
//             <li>Tax calculation</li>
//             <li>Multi-currency support</li>
//           </ul>
//         </Box>

//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: isMobile ? "column" : "row",
//             gap: 2,
//           }}
//         >
//           <Button
//             variant="contained"
//             size="large"
//             sx={{
//               backgroundColor: "#00e68a",
//               color: "white",
//               "&:hover": { backgroundColor: "#00ff99" },
//             }}
//             onClick={() => handleButtonClick("/auth/register")}
//           >
//             Get Started
//           </Button>
//           <Button
//             variant="outlined"
//             size="large"
//             sx={{
//               borderColor: "#00e68a",
//               color: "#00e68a",
//               "&:hover": { borderColor: "#00e68a", color: "#00ff99" },
//             }}
//             onClick={() => handleButtonClick("/auth/login")}
//           >
//             Sign In
//           </Button>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default LandingPage;

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Card,
  CardContent,
  Avatar,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import {
  Receipt,
  Payment,
  People,
  Assessment,
  Language,
  ExpandMore,
  Star,
  StarHalf,
  StarBorder,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

// Keyframes for animations
const floatAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LandingPage = () => {
  const theme = useTheme();

  // Professional media queries
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg")); // 600px - 1200px
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // > 1200px

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      navigate("/profile-complete");
    }
  }, [navigate]);

  const handleButtonClick = (path) => {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 200);
  };

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      avatar: "S",
      content: "This system cut my invoicing time by 70%. Highly recommended!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      avatar: "M",
      content:
        "The multi-currency support saved me so much hassle with international clients.",
      rating: 4.5,
    },
    {
      name: "Emily Rodriguez",
      role: "Consultant",
      avatar: "E",
      content: "Beautiful templates that make my business look professional.",
      rating: 5,
    },
  ];

  // FAQ data
  const faqs = [
    {
      question: "How secure is my data?",
      answer:
        "We use bank-level encryption and regular backups to ensure your data is always safe.",
    },
    {
      question: "Can I customize invoice templates?",
      answer:
        "Yes, you can fully customize templates or create your own from scratch.",
    },
    {
      question: "Is there a mobile app?",
      answer:
        "Our web app is fully responsive and works on all devices. Native apps coming soon!",
    },
    {
      question: "What payment methods do you support?",
      answer: "We integrate with Stripe, PayPal, and direct bank transfers.",
    },
  ];

  // Features data
  const features = [
    {
      icon: (
        <Receipt sx={{ fontSize: 40, color: "#00e68a", marginBottom: 2 }} />
      ),
      title: "Automated Invoicing",
      description:
        "Create invoices in seconds with our smart templates and automation tools.",
    },
    {
      icon: (
        <Payment sx={{ fontSize: 40, color: "#00e68a", marginBottom: 2 }} />
      ),
      title: "Payment Tracking",
      description:
        "Track payments, send reminders, and manage overdue invoices with ease.",
    },
    {
      icon: <People sx={{ fontSize: 40, color: "#00e68a", marginBottom: 2 }} />,
      title: "Client Management",
      description:
        "Store client details, payment terms, and history in one place.",
    },
    {
      icon: (
        <Assessment sx={{ fontSize: 40, color: "#00e68a", marginBottom: 2 }} />
      ),
      title: "Financial Reports",
      description:
        "Generate detailed reports for taxes, profits, and business insights.",
    },
    {
      icon: (
        <Language sx={{ fontSize: 40, color: "#00e68a", marginBottom: 2 }} />
      ),
      title: "Multi-Currency",
      description:
        "Work with clients worldwide with support for 20+ currencies and automatic conversion.",
    },
  ];

  // Render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star key={i} sx={{ color: "#FFD700", fontSize: "1rem" }} />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <StarHalf key={i} sx={{ color: "#FFD700", fontSize: "1rem" }} />
        );
      } else {
        stars.push(
          <StarBorder key={i} sx={{ color: "#FFD700", fontSize: "1rem" }} />
        );
      }
    }

    return stars;
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Progress Loader */}
      {loading && (
        <LinearProgress
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: "#00e68a",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#fff",
            },
          }}
        />
      )}

      {/* Left Content Section - 70% width */}
      <Box
        sx={{
          width: isMobile ? "100%" : "70%",
          padding: isMobile ? 2 : isTablet ? 4 : 6,
          overflowY: "auto",
          height: "100vh",
          maxWidth: "900px",
          scrollbarWidth: "none",
        }}
      >
        {/* Logo */}
        <Box sx={{ marginBottom: 4 }}>
          <Link to="/">
            <img
              src="/invoiceLogo.gif"
              alt="Invoice System Logo"
              style={{
                width: "70px",
                height: "auto",
                borderRadius: 50,
              }}
            />
          </Link>
        </Box>

        {/* Hero Section */}
        <Box
          sx={{
            marginBottom: 8,
            animation: `${fadeIn} 1s ease-out`,
          }}
        >
          <Typography
            variant={isMobile ? "h4" : isDesktop ? "h2" : "h3"}
            sx={{
              fontWeight: "bold",
              marginBottom: 2,
              color: "#333",
            }}
          >
            Streamline Your Invoicing Process
          </Typography>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{
              marginBottom: 3,
              color: "#555",
            }}
          >
            Professional invoices in minutes, not hours
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: 4,
              color: "#666",
              lineHeight: 1.6,
            }}
          >
            Our invoice generation system helps businesses of all sizes create,
            send, and track professional invoices effortlessly. Save time, get
            paid faster, and look professional with our powerful tools.
          </Typography>
        </Box>

        {/* Powerful Features Section */}
        <Box
          sx={{
            marginBottom: 8,
            animation: `${fadeIn} 1s ease-out 0.2s`,
            animationFillMode: "both",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              marginBottom: 4,
              color: "#333",
            }}
          >
            Powerful Features
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid
                xs={12}
                sm={6}
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: index % 2 === 0 ? "flex-start" : "flex-end",
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: isDesktop ? "400px" : "100%",
                    borderLeft: "4px solid #00e68a",
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 24px rgba(0, 230, 138, 0.2)",
                    },
                  }}
                >
                  <CardContent>
                    {feature.icon}
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        fontSize: isMobile ? "1.1rem" : "1.25rem",
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: isMobile ? "0.875rem" : "1rem",
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Testimonials Section */}
        <Box
          sx={{
            marginBottom: 8,
            animation: `${fadeIn} 1s ease-out 0.4s`,
            animationFillMode: "both",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              marginBottom: 4,
              color: "#333",
            }}
          >
            What Our Customers Say
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {testimonials.map((testimonial, index) => (
              <Grid
                xs={12}
                md={4}
                key={index}
                sx={{
                  marginTop: 4,
                }}
              >
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: "400px",
                    height: "100%",
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 24px rgba(0, 230, 138, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "#00e68a",
                        marginRight: 2,
                        width: 48,
                        height: 48,
                      }}
                    >
                      {testimonial.avatar}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {testimonial.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      marginBottom: 2,
                      flexGrow: 1,
                      fontStyle: "italic",
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Box>{renderStars(testimonial.rating)}</Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* FAQ Section */}
        <Box
          sx={{
            marginBottom: 8,
            animation: `${fadeIn} 1s ease-out 0.6s`,
            animationFillMode: "both",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              fontWeight: "bold",
              marginBottom: 4,
              color: "#333",
            }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion
              key={index}
              sx={{
                marginBottom: 2,
                borderRadius: "8px !important",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                "&:before": {
                  display: "none",
                },
                "&.Mui-expanded": {
                  margin: "16px 0",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore />}
                sx={{
                  "& .MuiAccordionSummary-content": {
                    margin: "12px 0",
                  },
                }}
              >
                <Typography fontWeight="bold">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            padding: 4,
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} InvoicePro. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Sticky Section - 30% width */}
      <Box
        sx={{
          width: isMobile ? "100%" : "30%",
          padding: isMobile ? 3 : isTablet ? 4 : 6,
          backgroundColor: "#fff",
          boxShadow: isMobile
            ? "0 -2px 10px rgba(0,0,0,0.05)"
            : "-2px 0 10px rgba(0,0,0,0.05)",
          position: isMobile ? "relative" : "fixed",
          right: 0,
          top: 0,
          height: "100vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant={isMobile ? "h5" : isDesktop ? "h4" : "h4"}
          sx={{
            fontWeight: "bold",
            marginBottom: 2,
            textAlign: "center",
          }}
        >
          Professional Invoice Generation System
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: 4,
            color: "text.secondary",
            textAlign: "center",
            fontSize: isMobile ? "0.875rem" : "1rem",
          }}
        >
          Create, manage, and track invoices effortlessly. Our system offers:
        </Typography>

        {/* Features List */}
        <Box
          sx={{
            textAlign: "left",
            marginBottom: 4,
            "& ul": {
              paddingLeft: 0,
            },
            "& li": {
              marginBottom: 2,
              display: "flex",
              alignItems: "center",
              fontSize: isMobile ? "0.875rem" : "1rem",
            },
          }}
        >
          <ul style={{ listStyleType: "none" }}>
            {[
              "Automated invoice generation",
              "Customizable templates",
              "Client management",
              "Payment tracking",
              "Tax calculation",
              "Multi-currency support",
            ].map((item, index) => (
              <li key={index}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: "#00e68a",
                    borderRadius: "50%",
                    marginRight: 2,
                  }}
                />
                {item}
              </li>
            ))}
          </ul>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            size={isMobile ? "medium" : "large"}
            fullWidth
            sx={{
              backgroundColor: "#00e68a",
              color: "white",
              "&:hover": {
                backgroundColor: "#00ff99",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 230, 138, 0.3)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => handleButtonClick("/auth/register")}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size={isMobile ? "medium" : "large"}
            fullWidth
            sx={{
              borderColor: "#00e68a",
              color: "#00e68a",
              "&:hover": {
                borderColor: "#00ff99",
                color: "#00ff99",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 230, 138, 0.2)",
              },
              transition: "all 0.3s ease",
            }}
            onClick={() => handleButtonClick("/auth/login")}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default LandingPage;
