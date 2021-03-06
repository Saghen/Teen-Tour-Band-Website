const PERMISSIONS = {
  SUPERUSER: 0,
  ADMIN: 1,
  MANAGER: 2,
  DEFAULT: 3
}

const STATUS = {
  UNREVIEWED: 0,
  INREVIEW: 1,
  COMPLETED: 2
}

const ALERTLEVEL = {
  NONE: 0,
  WARNING: 1,
  CRITICAL: 2
}

const SORTINGTYPES = {
  DATE: 0,
  ALERTLEVEL: 1,
  JOURNEYID: 2
}

module.exports = { PERMISSIONS, STATUS, ALERTLEVEL, SORTINGTYPES }
