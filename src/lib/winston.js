import winston from 'winston';
import dateformat from 'dateformat';
import chalk from 'chalk';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      // json: true,
      timestamp: function () {
        return dateformat(Date.now(), 'yyyy-mm-dd HH:MM:ss.l');
      },
      formatter: function (options) {
        var message = '';

        if (options.message !== undefined) {
          message = options.message;
        }

        var meta = '';

        if (options.meta && Object.keys(options.meta).length) {
          meta = '\n\t' + JSON.stringify(options.meta, null, 4);
        }

        var level = options.level.toUpperCase();

        switch (level) {
          case 'INFO':
            level = chalk.cyan(level);
            break;

          case 'WARN':
            level = chalk.yellow(level);
            break;

          case 'ERROR':
            level = chalk.red(level);
            break;

          default:
            break;
        }

        var output = [
          '[' + options.timestamp() + '][' + level + ']',
          message,
          meta
        ];

        return output.join(' ');
      }
    })
  ]
});
module.exports = logger;
