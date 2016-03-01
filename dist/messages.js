'use strict';
Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.print = print;
exports.summary = summary;
exports.clockoutSummary = clockoutSummary;
exports.prettyPrintEntry = prettyPrintEntry;
exports.reportSuccessfulNewTimeCard = reportSuccessfulNewTimeCard;
exports.reportSuccessfulClockIn = reportSuccessfulClockIn;
exports.reportSuccessfulClockOut = reportSuccessfulClockOut;
var chalk = require('chalk');
var convert = require('convert-seconds');
var pendel = require('pendel');
var zp = require('simple-zeropad');
var to24 = require('twelve-to-twentyfour');
var projectName = process.cwd();

/**
 * Error messages.
 *
 */

var errors = {
  clockOutIsPending: '\n' + chalk.bgRed(' TIMECARD ERROR ') + chalk.bold.white(' You must clockout before clocking in. \n') + chalk.bold.white('Tip:') + ' Clock out with the ' + chalk.cyan('clockout') + ' command, or edit the timecard file manually. \n',
  noClockInFound: '\n' + chalk.bgRed(' TIMECARD ERROR ') + chalk.bold.white(' You must clockin before clocking out. \n') + chalk.bold.white('Tip:') + ' Clock in with the ' + chalk.cyan('clockin') + ' command, or edit the timecard file manually. \n'
};

exports.errors = errors;
/**
 * General messages.
 *
 */

var messages = {
  createdNewTimeCard: '\n  ' + chalk.bgCyan.black(' TIMECARD ') + chalk.bold.white(' You have created a new timecard file. \n') + chalk.bold.white('  Tip:') + ' Use the ' + chalk.cyan('clockin') + ' and ' + chalk.cyan('clockout') + ' commands to record your time.\n',
  successfulClockin: '\n  ' + chalk.bgCyan.black(' TIMECARD ') + chalk.bold.white(' You have ') + chalk.bold.green('clocked in: ') + time() + '\n',
  successfulClockout: '\n  ' + chalk.bgCyan.black(' TIMECARD ') + chalk.bold.white(' You have ') + chalk.bold.red('clocked out: ') + time() + '\n',
  prettyPrintHeader: '\n  ' + chalk.bgCyan.black(' TIMECARD ') + chalk.cyan(' Logged Hours ') + '\n  ' + chalk.gray('Project: ') + chalk.gray(projectName) + '\n  ' + chalk.gray('______________________________________________\n'),
  prettyPrintBorder: chalk.gray('\n  ______________________________________________')
};

exports.messages = messages;
/**
 * Output data to the console.
 *
 * @param {string} str
 */

function print(str) {
  console.log('\n  ' + chalk.gray(str));
}

/**
 * A Helper function to generate the total time data.
 *
 * @note: This prints the total hours/mins/secs on the
 * bottom when the user types `timecard print`.
 *
 * @param {number} seconds - the number of seconds recorded in the timecard project.
 */

function summary(seconds) {
  var total = convert(seconds);
  var timeStr = makeTimeString(total);

  console.log('\n' + chalk.cyan('  Total Time: ') + chalk.gray(timeStr) + '\n');
  console.log('  ' + total.hours + chalk.white(' Hours ') + total.minutes + chalk.white(' Minutes ') + total.seconds + chalk.white(' Seconds '));
  console.log();
}

function clockoutSummary(shiftSeconds, totalSeconds) {
  var total = convert(totalSeconds);
  var shift = convert(shiftSeconds);
  var totalStr = makeTimeString(total);
  var shiftStr = makeTimeString(shift);

  console.log(chalk.cyan('\n  Total Shift Time: ') + chalk.gray(shiftStr));
  console.log(chalk.cyan('  Total Project Time: ') + chalk.gray(totalStr));
}

/**
 * Pretty-print the timecard data.
 *
 * @param {object} timeobj - the timecard data object
 */

function prettyPrintEntry(timeobj) {
  var time = makeTimeString(pendel(timeobj.startTime, timeobj.endTime));

  var tasks;

  if (timeobj.hasOwnProperty('tasks') && timeobj.tasks.length > 0) {
    tasks = '';

    for (var i = 0; i < timeobj.tasks.length; i++) {
      tasks += '   - ' + timeobj.tasks[i] + '\n';
    }
  }
  console.log('  ' + chalk.white(timeobj.date) + chalk.cyan(' ' + to24(timeobj.startTime) + ' - ' + to24(timeobj.endTime)) + chalk.gray(' [') + time + chalk.gray(']'));

  if (tasks) {
    console.log('\n' + chalk.gray(tasks) + '\n');
  }
}

/**
 * Get the current time in the format: 'Wed Apr 09 2015'
 *
 * @returns {string}
 */

function time() {
  var date = new Date().toString();
  return date.slice(16, 24);
}

/**
 * Make a timestring in the format of '00:00:00'
 *
 * @param {object} timeObj - the duration object returned by pendel.
 * @returns {string}
 */

function makeTimeString(timeObj) {
  return zp(timeObj.hours) + ':' + zp(timeObj.minutes) + ':' + zp(timeObj.seconds);
}

/**
 * Pretty-print a successful 'timecard new' message.
 *
 * @note: This gets called after a new timecard
 * has been created with `timecard new`
 */

function reportSuccessfulNewTimeCard() {
  print(this.filepath);
  console.log(messages.createdNewTimeCard);
}

/**
 * Pretty-print a successful clockin message.
 *
 */

function reportSuccessfulClockIn() {
  console.log(messages.successfulClockin);
}

/**
 * Pretty-print a successful clockout message.
 *
 */

function reportSuccessfulClockOut() {
  console.log(messages.successfulClockout);
}