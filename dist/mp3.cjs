"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instantiate = instantiate;
exports["default"] = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Loads the `mp3.wasm` and returns the main class `Encoder`.
 * @module @etercast/mp3
 *
 * @func instantiate
 * @param {string|URL|Request} [wasm='mp3.wasm'] WASM file URL.
 * @returns Promise<class Encoder|Error>
 */
function instantiate() {
  var wasm = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : './mp3.wasm';
  return fetch(wasm).then(function (response) {
    return response.arrayBuffer();
  }).then(function (arrayBuffer) {
    return WebAssembly.instantiate(arrayBuffer, {
      // TODO: We really don't need these imports because mp3.wasm
      // does not handle file descriptors.
      wasi_unstable: {
        fd_close: function fd_close() {
          console.log('fd_close');
        },
        fd_seek: function fd_seek() {
          console.log('fd_seek');
        },
        fd_write: function fd_write() {
          console.log('fd_write');
        },
        proc_exit: function proc_exit() {
          console.log('proc_exit');
        }
      }
    });
  }).then(function (_ref) {
    var instance = _ref.instance;
    // TODO: There's an extra export called _start that's not used
    // but is defined in WASI. Look for ways to remove this unnecessary
    // export.
    var _instance$exports = instance.exports,
        memory = _instance$exports.memory,
        mp3_create = _instance$exports.mp3_create,
        mp3_init = _instance$exports.mp3_init,
        mp3_encode = _instance$exports.mp3_encode,
        mp3_destroy = _instance$exports.mp3_destroy;
    /**
     * Returns the error codes from the MP3 encoder.
     * @param {number} errorCode
     * @return {string}
     */

    function getEncoderError(errorCode) {
      switch (errorCode) {
        default:
          return "Unknown error: ".concat(errorCode);

        case -1:
          return 'Invalid input sample rate';

        case -2:
          return 'Invalid input channels (mono and stereo only)';

        case -3:
          return 'Invalid quality';

        case -4:
          return 'Error calling lame_init';

        case -5:
          return 'Error calling lame_init_params';

        case -6:
          return 'Error reallocating buffers';

        case -7:
          return 'Too much input samples';

        case -8:
          return 'Error calling lame_encode_buffer_ieee_float';

        case -9:
          return 'Error calling lame_encode_flush';

        case -10:
          return 'Invalid number of samples passed';

        case -11:
          return 'Invalid input samples';

        case -100:
          return 'Ok';

        case -101:
          return 'Error calling lame_encode_buffer_ieee_float: Buffer was too small';

        case -102:
          return 'Error calling lame_encode_buffer_ieee_float: malloc() problem';

        case -103:
          return 'Error calling lame_encode_buffer_ieee_float: lame_init_params not called';

        case -104:
          return 'Error calling lame_encode_buffer_ieee_float: Psycho acoustic problems';

        case -110:
          return 'Error calling lame_encode_buffer_ieee_float: No memory';

        case -111:
          return 'Error calling lame_encode_buffer_ieee_float: Bad bitrate';

        case -112:
          return 'Error calling lame_encode_buffer_ieee_float: Bad samplefreq';

        case -113:
          return 'Error calling lame_encode_buffer_ieee_float: Internal error';
      }
    }
    /**
     * Encoder states.
     * @readonly
     * @enum {string}
     */


    var EncoderState = {
      /** Indicates that the encoder is running and is capable of encode MP3 frames. */
      RUNNING: 'running',

      /** Indicates that the encoder was closed and no longer can encode MP3 frames. */
      CLOSED: 'closed',

      /** Indicates that something went wrong. */
      ERROR: 'error'
    };
    /**
     * Encoder mode.
     * @readonly
     * @enum {number}
     */

    var EncoderMode = {
      /** Constant bit-rate */
      CBR: 0,

      /** Variable bit-rate */
      VBR: 1
    };
    /**
     * MP3 encoder options
     * @typedef {Object} EncoderOptions
     * @property {number} sampleRate Input/output sample rate. Usually this is the value from an AudioContext.
     * @property {number} numChannels Number of input/output channels. MP3 supports 1 (mono) or 2 (stereo) channels
     * @property {number} quality Encoding quality (0 - lowest, 9 - highest).
     *                              In VBR (Variable Bit-Rate) this quality indicates an average kbps but in
     *                              CBR (Constant Bit-Rate) 0 is equal to 32kbps and 9 is equal to 320kbps.
     * @property {number} samples Number of samples that will be encoded each time `encode` is called.
     * @property {EncoderMode} mode Encoding mode (0 - CBR, 1 - VBR).
     */

    /**
     * Not exported by default in the module, you need
     * to call `instantiate` to retrieve this class.
     *
     * @example
     * import instantiate from '@etercast/mp3'
     *
     * const Encoder = await instantiate()
     * const encoder = new Encoder(encoderOptions)
     * encoder.encode(leftChannelData, rightChannelData)
     * encoder.close()
     */

    var Encoder = /*#__PURE__*/function () {
      _createClass(Encoder, null, [{
        key: "create",

        /**
         * Creates a new MP3 encoder. This is equivalent to calling
         * the constructor using the `new` keyword. It's useful
         * if you need a function that instantiates the Encoder.
         * @param {EncoderOptions} options
         * @example
         * import instantiate from '@etercast/mp3'
         *
         * const Encoder = await instantiate()
         * const encoder = Encoder.create(encoderOptions)
         * @returns {Encoder}
         */
        value: function create(options) {
          return new Encoder(options);
        }
        /**
         * Internally this calls the exported method `mp3_create` to
         * make WASM module create a new structure to hold all the LAME
         * encoding data. It also calls `mp3_init` to establish encoder
         * options like number of channels, quality, sampleRate, etc.
         * @param {EncoderOptions} options
         */

      }]);

      function Encoder(options) {
        _classCallCheck(this, Encoder);

        var _sampleRate$numChanne = _objectSpread({
          sampleRate: 44100,
          numChannels: 1,
          quality: 9,
          samples: 2048,
          mode: 0
        }, options),
            sampleRate = _sampleRate$numChanne.sampleRate,
            numChannels = _sampleRate$numChanne.numChannels,
            quality = _sampleRate$numChanne.quality,
            samples = _sampleRate$numChanne.samples,
            mode = _sampleRate$numChanne.mode;

        this._error = null;
        this._state = EncoderState.RUNNING;
        this._pointer = null;
        var pointer = mp3_create();

        if (!pointer) {
          return this._throw(new Error('Cannot create mp3 encoder'));
        }

        this._pointer = pointer;
        var internalRegisters = 10;
        var internal = new Int32Array(memory.buffer, pointer, internalRegisters);
        this._internal = internal;
        var errorCode = mp3_init(this._pointer, sampleRate, numChannels, quality, samples, mode);

        if (errorCode < 0) {
          return this._throw(new Error(getEncoderError(errorCode)));
        }

        var _internal = _slicedToArray(internal, 10),
            outputBufferMaxSize = _internal[1],
            inputSamples = _internal[4],
            inputBufferLeftPointer = _internal[7],
            inputBufferRightPointer = _internal[8],
            outputBufferPointer = _internal[9];

        this._inputBufferLeft = new Float32Array(memory.buffer, inputBufferLeftPointer, inputSamples);
        this._inputBufferRight = new Float32Array(memory.buffer, inputBufferRightPointer, inputSamples);
        this._outputBuffer = new Uint8Array(memory.buffer, outputBufferPointer, outputBufferMaxSize);
      }
      /**
       * Encoder state
       * @type {EncoderState}
       */


      _createClass(Encoder, [{
        key: "_throw",

        /**
         * Throws an error
         * @private
         * @param {Error} error
         */
        value: function _throw(error) {
          this._state = EncoderState.ERROR;
          this._error = error;
          throw error;
        }
        /**
         * Encodes raw Float 32-bit audio data into MP3 frames. An MP3
         * frame consist of a header and payload, this makes MP3 streamable
         * and implies that you can merge two files easily by concatenating them.
         *
         * If you need to merge two channels then you should use a `ChannelMergeNode`
         * and then reencode the audio.
         *
         * @example
         * import instantiate from '@etercast/mp3'
         *
         * const Encoder = await instantiate()
         * const encoder = new Encoder({
         *   sampleRate,
         *   samples,
         *   numChannels,
         *   quality,
         *   mode
         * })
         * encoder.encode(leftChannelData, rightChannelData)
         *
         * @param {Float32Array} left Left channel (mono)
         * @param {Float32Array} [right] Right channel (stereo)
         * @returns {Uint8Array} Returns a bunch of encoded frames
         */

      }, {
        key: "encode",
        value: function encode(left, right) {
          if (this._state !== EncoderState.RUNNING) {
            this._throw(new Error('Encoder already closed'));
          }

          var samples = 0;

          if (left) {
            samples = left.length;

            this._inputBufferLeft.set(left);

            if (right) {
              if (samples !== right.length) {
                this._throw(new Error('Encoder channels have different lengths'));
              }

              this._inputBufferRight.set(right);
            }
          } // Codifica el MP3.


          var errorCode = mp3_encode(this._pointer, samples);

          if (errorCode < 0) {
            this._throw(new Error(getEncoderError(errorCode)));
          }

          return this._outputBuffer.slice(0, this.outputBufferSize);
        }
        /**
         * Closes the encoder. After this method any call to `encode`
         * will throw an Error. If you need to append more data after
         * closing an encoder you can instantiate a new Encoder and then
         * concatenate all the new data with the old data.
         *
         * @example
         * import instantiate from '@etercast/mp3'
         *
         * const Encoder = await instantiate()
         * const encoder = new Encoder()
         *
         * // Do something with the encoder...
         *
         * encoder.close()
         *
         * // `encoder` is no longer usable and all the
         * // memory reserved is freed.
         */

      }, {
        key: "close",
        value: function close() {
          if (this._state !== EncoderState.RUNNING) {
            this._throw(new Error('Encoder already closed'));
          }

          var errorCode = mp3_destroy(this._pointer);

          if (errorCode < 0) {
            this._throw(new Error(getEncoderError(errorCode)));
          }

          this._inputBufferLeft = null;
          this._inputBufferRight = null;
          this._outputBuffer = null;
          this._pointer = null;
          this._internal = null;
          this._state = EncoderState.CLOSED;
        }
      }, {
        key: "state",
        get: function get() {
          return this._state;
        }
        /**
         * Error
         * @type {null|Error}
         */

      }, {
        key: "error",
        get: function get() {
          return this._error;
        }
        /**
         * Current output buffer size.
         * @type {number}
         */

      }, {
        key: "outputBufferSize",
        get: function get() {
          return this._internal[0];
        }
        /**
         * Max. output buffer size.
         * @type {number}
         */

      }, {
        key: "outputBufferMaxSize",
        get: function get() {
          return this._internal[1];
        }
        /**
         * Output sample rate
         * @type {number}
         */

      }, {
        key: "outputSampleRate",
        get: function get() {
          return this._internal[2];
        }
        /**
         * Output quality
         * @type {number}
         */

      }, {
        key: "outputQuality",
        get: function get() {
          return this._internal[3];
        }
        /**
         * Input samples
         * @type {number}
         */

      }, {
        key: "inputSamples",
        get: function get() {
          return this._internal[4];
        }
        /**
         * Input sample rate
         * @type {number}
         */

      }, {
        key: "inputSampleRate",
        get: function get() {
          return this._internal[5];
        }
        /**
         * Input number of channels (1 - mono, 2 - stereo)
         * @type {number}
         */

      }, {
        key: "inputChannels",
        get: function get() {
          return this._internal[6];
        }
        /**
         * Indicates that the encoder is running.
         * @type {boolean}
         */

      }, {
        key: "isRunning",
        get: function get() {
          return this._state === EncoderState.RUNNING;
        }
        /**
         * Indicates that the encoder is running.
         * @type {boolean}
         */

      }, {
        key: "isClosed",
        get: function get() {
          return this._state === EncoderState.CLOSED;
        }
      }]);

      return Encoder;
    }();

    return Encoder;
  });
}

var _default = instantiate;
exports["default"] = _default;
