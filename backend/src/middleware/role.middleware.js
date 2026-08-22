import { ApiError } from '../utils/apiError.js';

export const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.profile) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    const userRole = req.profile.role;

    if (!allowedRoles.includes(userRole)) {
      return next(
        ApiError.forbidden(
          `Action requires one of the following roles: [${allowedRoles.join(', ')}]. Current role: ${userRole}`
        )
      );
    }

    return next();
  };
};

export const requireAdmin = authorize(['ADMIN']);
export const requireModerator = authorize(['ADMIN', 'MODERATOR']);
