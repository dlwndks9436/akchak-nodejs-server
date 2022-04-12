"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config = new aws_sdk_1.default.Config({
    region: process.env.AWS_DEFAULT_REGION,
});
const s3 = new aws_sdk_1.default.S3();
exports.default = ({ bucket, key, expires }) => {
    const signedUrl = s3.getSignedUrl("getObject", {
        Key: key,
        Bucket: bucket,
        Expires: expires || 900, // S3 default is 900 seconds (15 minutes)
    });
    return signedUrl;
};
