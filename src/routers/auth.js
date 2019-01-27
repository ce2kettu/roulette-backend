import { Router } from 'express';
import passport from 'passport';

let router = Router();

/**
 * GET /auth/account
 * Returns the current user data
 */
router.get('/account', ensureAuthenticated, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ user: req.user }));
});

/**
 * GET /auth/logout
 * Logouts the current user
 */
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

/**
 * GET /auth/steam/login
 * Redirect user to steam login page
 */
router.get('/steam/login', passport.authenticate('steam'));

/**
 * GET /auth/steam/callback
 * Redirect user after authentication
 */
router.get('/steam/callback',
    passport.authenticate('steam', { failureRedirect: '/' }),
    (req, res) => { res.redirect('/auth/account'); }
);


// Simple route middleware to ensure the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/auth/steam');
}

export default router