const { json } = require('express');
const { IOCService } = require('iocjs');

module.exports = {
  HelloWorld: {
    src: class HelloWorld extends IOCService {
      serve(...args) {
        return 'hello world';
      }
    },
  },

  ReverseInput: {
    src: class ReverseInput extends IOCService {
      serve(...args) {
        return args.reduce((accum, current) => {
          // Ensure that all arguments are string
          for (let i = current.length - 1; i >= 0; i--) accum += current[i];
          accum += ' ';
          return accum;
        }, '');
      }
    },
  },

  RemoveAs: {
    src: class RemoveAs extends IOCService {
      serve(...args) {
        return args.reduce((accum, current) => {
          // Ensure that all arguments are string
          current = String(current);
          for (let i = 0; i < current.length; i++) {
            if (current[i].toLowerCase() != 'a') accum += current[i];
          }
          return accum;
        }, '');
      }
    },
  },

  Capitalize: {
    src: class Capitalize extends IOCService {
      serve(...args) {
        return (
          this.header + args.reduce((a, c) => a + String(c).toUpperCase(), '')
        );
      }
    },
    parameters: {
      header: 'This is the string capitalized: ',
    },
  },
};
