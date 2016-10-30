//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

/**
 * @internal
 */
namespace egret.web {

    /**
     * @internal
     */
    export class WebBitmapData extends HashObject implements elf.BitmapData {

        /**
         * Creates a BitmapData object with a specified width and height. If you specify a value for the fillColor parameter,
         * every pixel in the bitmap is set to that color.<br/>
         * By default, the bitmap is created as transparent, unless you pass the value false for the transparent parameter.
         * After you create an opaque bitmap, you cannot change it to a transparent bitmap. Every pixel in an opaque bitmap
         * uses only 24 bits of color channel information. If you define the bitmap as transparent, every pixel uses 32 bits
         * of color channel information, including an alpha transparency channel.
         * @param width The width of the bitmap image in pixels.
         * @param height The height of the bitmap image in pixels.
         * @param transparent (Not supported in Web platform) Specifies whether the bitmap image supports per-pixel
         * transparency. The default value is true (transparent). To create a fully transparent bitmap, set the value of
         * the transparent parameter to true and the value of the fillColor parameter to 0x00000000 (or to 0). Setting the
         * transparent property to false can result in minor improvements in rendering performance. The default value is true.
         * @param fillColor (Not supported in Web platform) A 32-bit ARGB color value that you use to fill the bitmap image area.
         * The default value is 0x00000000 (transparent black).
         */
        public constructor(width:number, height:number, transparent?:boolean, fillColor?:number) {
            super();
            let source:HTMLImageElement|HTMLCanvasElement;
            if (arguments.length == 1 && <any>width instanceof HTMLImageElement) {
                source = <HTMLImageElement><any>width;
            }
            else {
                width = +width || 0;
                height = +height || 0;
                if (width <= 0 || height <= 0) {
                    throw new Error("Invalid BitmapData.");
                }
                let easelHost = new WebEasel(width, height);
                source = easelHost.canvas;
                this.buffer = easelHost.buffer;
            }

            this.source = source;
            this.width = source.width;
            this.height = source.height;
        }

        /**
         * @internal
         * The handle of the backend bitmap data.
         */
        $handle:any = this;

        /**
         * The width of the bitmap image in pixels.
         */
        public width:number;

        /**
         * The height of the bitmap image in pixels.
         */
        public height:number;

        /**
         * Always returns true in browser.
         */
        public transparent:boolean = true;

        /**
         * The drawable source.
         */
        public source:HTMLImageElement | HTMLCanvasElement | HTMLVideoElement;

        public buffer:elf.RenderBuffer;

        private getRenderBuffer():elf.RenderBuffer {
            if (this.buffer || !this.source) {
                return this.buffer;
            }
            let easelHost = new WebEasel(this.width, this.height);
            let buffer = easelHost.buffer;
            buffer.drawImage(this, 0, 0);
            this.source = easelHost.canvas;
            this.buffer = buffer;
            return buffer;

        }

        /**
         * Generates an Uint8ClampedArray from a rectangular region of pixel data. Writes four unsigned integers
         * (R, G, B, A) for each pixel into the array.
         * @param x The x coordinate of the upper left corner of the rectangle from which the pixel data will be extracted.
         * @param y The y coordinate of the upper left corner of the rectangle from which the pixel data will be extracted.
         * @param width The width of the rectangle from which the pixel data will be extracted. The default value is 1.
         * @param height The height of the rectangle from which the pixel data will be extracted. The default value is 1.
         * @returns An Uint8ClampedArray containing the pixel data for the given rectangle of the BitmapData.
         */
        public getPixels(x:number, y:number, width:number = 1, height:number = 1):Uint8ClampedArray {
            let buffer = this.getRenderBuffer();
            return buffer.getPixels(x, y, width, height);
        }

        /**
         * Frees memory that is used to store the BitmapData object. <br/>
         * When the dispose() method is called on an image, the width and height of the image are set to 0. All subsequent
         * calls to methods or properties of this BitmapData instance fail, and an exception is thrown. BitmapData.dispose()
         * releases the memory occupied by the actual bitmap data, immediately. After using BitmapData.dispose(), the
         * BitmapData object is no longer usable and the runtime throws an exception if you call functions on the BitmapData
         * object. However, BitmapData.dispose() does not garbage collect the BitmapData object (approximately 128 bytes);
         * the memory occupied by the actual BitmapData object is released at the time the BitmapData object is collected
         * by the garbage collector.
         */
        public dispose():void {
            this.width = this.height = 0;
            this.source = null;
            this.buffer = null;
        }

        /**
         * Draws the source display object onto the bitmap image. You can specify matrix, alpha, blendMode, and a destination
         * clipRect parameter to control how the rendering performs. Optionally, you can specify whether the bitmap should
         * be smoothed when scaled (this works only if the source object is a BitmapData object).
         * @param source The display object or BitmapData object to draw to the BitmapData object.
         * @param matrix A Matrix object used to scale, rotate, or translate the coordinates of the node. If you do not
         * want to apply a matrix transformation to the image, set this parameter to an identity matrix, or pass a null
         * value.
         * @param alpha A float value that you use to adjust the alpha values of the node.
         * @param blendMode A string value, from the BlendMode class, specifying the blend mode to be applied to the node.
         * @param clipRect A Rectangle object that defines the area of the source object to draw. If you do not supply
         * this value, no clipping occurs and the entire source object is drawn.
         * @param smoothing  A Boolean value that determines whether a BitmapData object is smoothed when scaled or rotated,
         * due to a scaling or rotation in the matrix parameter. The smoothing parameter only applies if the source parameter
         * is a BitmapData object. With smoothing set to false, the rotated or scaled BitmapData image can appear pixelated
         * or jagged.
         */
        public draw(source:DisplayObject|BitmapData, matrix?:Matrix, alpha?:number,
                    blendMode?:string, clipRect?:Rectangle, smoothing?:boolean):void {
            if (!(source instanceof egret.DisplayObject) && !(source instanceof egret.BitmapData)) {
                throw new Error("Parameter 0 is of the incorrect type. Should be type egret.DisplayObject|egret.BitmapData.");
            }
            this.getRenderBuffer();
            let buffer = sys.sharedBuffer;
            sys.Serializer.writeDrawToBitmap(this, buffer, source, matrix, alpha, blendMode, clipRect, smoothing);
            sys.UpdateAndGet(buffer);
            buffer.clear();
        }
    }

    egret.BitmapData = WebBitmapData;
}