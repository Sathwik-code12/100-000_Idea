import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { v4 as uuidv4 } from "uuid";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage.js";
import { User as SchemaUser } from "../shared/schema.js";
import nodemailer from "nodemailer";
declare global {
  namespace Express {
    interface User extends SchemaUser { }
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "USER_NOT_FOUND" });
          }
          if (!(await comparePasswords(password, user.password))) {
            return done(null, false, { message: "INVALID_PASSWORD" });
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user: SchemaUser, done) => done(null, user.id));
  passport.deserializeUser(async (id:string, done) => {
    try {
      const user = await storage.getUser(id);

      if (!user) {
        // user not found → destroy old session
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });


  // app.post("/api/register", async (req, res, next) => {
  //   try {
  //     const { name, email, password } = req.body;

  //     // Check if user already exists
  //     const existingUser = await storage.getUserByEmail(email);
  //     if (existingUser) {
  //       return res.status(400).json({ message: "Email already registered" });
  //     }

  //     // Create new user
  //     const hashedPassword = await hashPassword(password);
  //     const user = await storage.createUser({
  //       id: uuidv4() as string,
  //       name,
  //       email,
  //       password: hashedPassword,
  //     });

  //     req.login(user, (err) => {
  //       if (err) return next(err);
  //       res.status(201).json({
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         createdAt: user.createdAt,
  //         updatedAt: user.updatedAt,
  //       });
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // });

  // app.post("/api/login", (req, res, next) => {
  //   passport.authenticate("local", (err: any, user: any, info: any) => {
  //     if (err) return next(err);
  //     if (!user) {

  //       // Handle user not found case specifically - new user needs to sign up
  //       if (info?.message === "USER_NOT_FOUND") {
  //         return res.status(404).json({
  //           message: "Account not found. Please sign up first to create your account.",
  //           code: "USER_NOT_FOUND",
  //           type: "NO_ACCOUNT",
  //           action: "SIGNUP_REQUIRED"
  //         });
  //       }
  //       // Handle wrong password case - existing user with wrong password
  //       if (info?.message === "INVALID_PASSWORD") {
  //         return res.status(401).json({
  //           message: "Invalid email or password. Please try again.",
  //           code: "INVALID_PASSWORD",
  //           type: "WRONG_CREDENTIALS"
  //         });
  //       }
  //       // Handle other authentication failures
  //       return res.status(401).json({
  //         message: "Authentication failed. Please try again.",
  //         code: "AUTH_FAILED",
  //         type: "GENERAL_ERROR"
  //       });
  //     }
  //     req.login(user, (err) => {
  //       if (err) return next(err);
  //       res.status(200).json({
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         createdAt: user.createdAt,
  //         updatedAt: user.updatedAt,
  //       });
  //     });
  //   })(req, res, next);
  // });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  // app.get("/api/user", (req, res) => {
  //   if (!req.isAuthenticated()) {
  //     return res.sendStatus(401);
  //   }
  //   const user = req.user as SchemaUser;
  //   res.json({
  //     id: user.id,
  //     name: user.name,
  //     email: user.email,
  //     last_name: user.last_name,
  //     phone: user.phone,
  //     gender: user.gender,
  //     age: user.age,
  //     aadhar_id: user.aadhar_id,
  //     annual_income: user.annual_income,
  //     caste: user.caste,
  //     area: user.area,
  //     address: user.address,
  //     password: user.password,
  //     createdAt: user.createdAt,
  //     updatedAt: user.updatedAt,
  //   });
  // });
  // // Express route
  // app.put("/api/user/update", async (req, res) => {
  //   if (!req.isAuthenticated()) {
  //     return res.sendStatus(401);
  //   }
  //   const user = req.user as SchemaUser;

  //   const {
  //     id, // user id must come from request (or session)
  //     name,
  //     last_name,
  //     phone,
  //     gender,
  //     age,
  //     aadhar_id,
  //     annual_income,
  //     caste,
  //     area,
  //     address,
  //     email,
  //     password
  //   } = req.body;

  //   try {
  //     // Check if email is changing
  //     // if (email) {
  //     //   const existingUser = await storage.getUserByEmail(email);
  //     //   if (existingUser && existingUser.id !== id) {
  //     //     return res.status(400).json({ message: "Email already registered" });
  //     //   }
  //     // }

  //     // Hash password if provided
  //     let hashedPassword = password;
  //     if (password) {
  //       const bcrypt = await import("bcrypt");
  //       hashedPassword = await bcrypt.hash(password, 10);
  //     }
  //     const user_id = user.id
  //     const updatedUser = await storage.updateUser({
  //       id: user_id,
  //       name,
  //       last_name,
  //       phone,
  //       gender,
  //       age,
  //       aadhar_id,
  //       annual_income,
  //       caste,
  //       area,
  //       address,
  //       email,
  //       password: hashedPassword,
  //     });

  //     return res.json({ message: "User updated successfully", user: updatedUser });
  //   } catch (err) {
  //     console.error(err);
  //     return res.status(500).json({ message: "Server error" });
  //   }
  // });
  app.put("/api/user/update-password", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const { currentPassword, newPassword } = req.body;
      const user = req.user as SchemaUser;

      // Verify current password
      if (!(await comparePasswords(currentPassword, user.password))) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Validate new password length
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "New password must be at least 6 characters long" });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      const updatedUser = await storage.updateUserPassword({
        id: user.id,
        password: hashedPassword
      });

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  });
  // const transporter = nodemailer.createTransport(
  //   {
  //     host: "smtp.gmail.com",
  //     port: parseInt("587"),
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       // user: process.env.EMAIL_USER,
  //       // pass: process.env.EMAIL_PASS,
  //       user:"jeeva.smiksystems@gmail.com",
  //       pass:"hoag cgsp vbwr svdr"
  //     },
  //   }
  // );
  const transporter = nodemailer.createTransport({
    host: "mail.10000ideas.com",
    port: 465,
    secure: true,
    auth: {
      user: "info@10000ideas.com",
      pass: "Ideas@7890",
    },
  });
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection error:", error);
    } else {
      console.log("SMTP connection successful:", success);
    }
  });

  async function sendOtpEmail(email: string, otp: string) {
    try {
      const info = await transporter.sendMail({
        from: `"10000Ideas" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Email Verification - 10000Ideas",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Email Verification</h2>
          <p>Thank you for signing up with 10000Ideas. Please use the following OTP to verify your email address:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p>Thank you,<br>Team 10000Ideas</p>
        </div>
      `,
      });
      console.log("Email sent: %s", info.messageId);
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }
  // Update the register endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const { name, email, phone, password } = req.body;

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      console.log("existingUser", existingUser)
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Create new user with isActive false
      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        name,
        email,
        phone,
        password: hashedPassword,
      });

      // Generate and send OTP
      const otp = await storage.createEmailVerificationOtp(email);
      const emailSent = await sendOtpEmail(email, otp);

      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }

      res.status(201).json({
        message: "Registration successful. Please check your email for verification OTP.",
        userId: user.id,
        email: user.email,
        requiresVerification: true,
      });
    } catch (error) {
      console.log("error", error)
      next(error);
    }
  });

  // Add OTP verification endpoint
  app.post("/api/verify-email", async (req, res, next) => {
    try {
      const { email, otp } = req.body;

      const isValid = await storage.verifyEmailOtp(email, otp);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Get the user and log them in
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json({
          message: "Email verified successfully",
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
          },
        });
      });
    } catch (error) {
      next(error);
    }
  });

  // Add resend OTP endpoint
  app.post("/api/resend-otp", async (req, res, next) => {
    try {
      const { email } = req.body;

      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if email is already verified (isActive)
      if (user.isActive) {
        return res.status(400).json({ message: "Email is already verified" });
      }

      // Generate and send new OTP
      const otp = await storage.createEmailVerificationOtp(email);
      const emailSent = await sendOtpEmail(email, otp);

      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send verification email" });
      }

      res.status(200).json({
        message: "OTP sent successfully. Please check your email.",
      });
    } catch (error) {
      next(error);
    }
  });

  // Update the login endpoint to check isActive
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        // Handle user not found case
        if (info?.message === "USER_NOT_FOUND") {
          return res.status(404).json({
            message: "Account not found. Please sign up first to create your account.",
            code: "USER_NOT_FOUND",
            type: "NO_ACCOUNT",
            action: "SIGNUP_REQUIRED"
          });
        }
        // Handle wrong password case
        if (info?.message === "INVALID_PASSWORD") {
          return res.status(401).json({
            message: "Invalid email or password. Please try again.",
            code: "INVALID_PASSWORD",
            type: "WRONG_CREDENTIALS"
          });
        }
        // Handle other authentication failures
        return res.status(401).json({
          message: "Authentication failed. Please try again.",
          code: "AUTH_FAILED",
          type: "GENERAL_ERROR"
        });
      }

      // Check if email is verified (isActive)
      if (!user.isActive) {
        return res.status(403).json({
          message: "Please verify your email before logging in.",
          code: "EMAIL_NOT_VERIFIED",
          type: "VERIFICATION_REQUIRED",
          email: user.email
        });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json({
          id: user.id,
          name: user.name,
          email: user.email,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        });
      });
    })(req, res, next);
  });

  // Update the user endpoint to include isActive
  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    const user = req.user as SchemaUser;
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      // ... other fields
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });
}
function sendOtpEmail(email: any, otp: string) {
  throw new Error("Function not implemented.");
}