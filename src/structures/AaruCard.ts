import { createCanvas, loadImage } from "@napi-rs/canvas";
import { registerFont } from "../functions/registerFont";
import type { AaruCardOption } from "../typings/types";
import { cropImage } from "cropify";

registerFont("Righteous-Regular.ttf", "Righteous");

const AaruCard = async (options: AaruCardOption): Promise<Buffer> => {
    if (!options.thumbnail) throw new Error("Thumbnail is required");
    if (!options.background) throw new Error("Background is required");
    if (!options.text) throw new Error("Text is required");
    if (options.text.length > 10) throw new Error("Text length cannot be more than 10 characters");
    if (!options.title) throw new Error("Title is required");
    if (!options.author) throw new Error("Author is required");
    if (!options.requestor) throw new Error("Requestor is required");
    if (!options.duration) throw new Error("Duration is required");

    const frame = createCanvas(1700, 560);
    const ctx = frame.getContext("2d");
    
    if (options.title.length > 15) options.title = `${options.title.slice(0, 12)}...`;
    if (options.author.length > 16) options.author = `${options.author.slice(0, 13)}...`;
    if (options.requestor.length > 16) options.requestor = `${options.requestor.slice(0, 13)}...`;

    const backgroundImg = await loadImage(options.background);
    const scale = Math.max(1700 / backgroundImg.width, 560 / backgroundImg.height);
    const scaledWidth = backgroundImg.width * scale;
    const scaledHeight = backgroundImg.height * scale;
    const offsetX = (scaledWidth - 1700) / 2;
    const offsetY = (scaledHeight - 560) / 2;

    ctx.save();
    roundRect(ctx, 0, 0, 1700, 560, 40, true, false);
    ctx.clip();
    ctx.drawImage(backgroundImg, -offsetX, -offsetY, scaledWidth, scaledHeight);
    ctx.globalAlpha = 0.7;
    ctx.filter = "blur(20px)";
    ctx.drawImage(backgroundImg, -offsetX, -offsetY, scaledWidth, scaledHeight);
    ctx.globalAlpha = 1;
    ctx.filter = "none";
    ctx.restore();

    const thumbnail = await loadImage(
        await cropImage({
            imagePath: options.thumbnail,
            width: 560,
            height: 560,
            cropCenter: true,
        })
    );

    ctx.save();
    roundRect(ctx, 45, 40, 480, 480, 20, true, false);
    ctx.clip();
    ctx.drawImage(thumbnail, 0, 0, 480, 480, 45, 40, 480, 480);
    ctx.restore();

    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    roundRect(ctx, 567, 40, 1700 - 550 - 30 * 2, 560 - 40 * 2, 30, true, false);

    ctx.fillStyle = "white";
    ctx.font = "bold 70px 'Righteous'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(options.title, 560 + 40, 80);

    ctx.fillStyle = "#A79D9D";
    ctx.font = "50px 'Righteous'";
    ctx.fillText(options.author, 560 + 40, 190);

    if (options.requestor) {
        ctx.font = "40px 'Righteous'";
        ctx.fillText(`Requestor: ${options.requestor}`, 560 + 40, 400);
    }

    ctx.fillStyle = "white";
    ctx.font = "bold 70px 'Righteous'";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(options.text, 1700 - 60 * 2, 80);

    ctx.font = "40px 'Righteous'";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(`Duration: ${options.duration}`, 1700 - 80 * 2, 500 - 60);

    ctx.fillStyle = "red";
    for (let i = 0; i < 30; i++) {
        const barHeight = Math.random() * 80;
        const x = 1700 - 40 * 2 - (30 - i) * (8.7 + 5) - 40;
        const y = 40 + 140 + (80 - barHeight) / 2;
        ctx.fillRect(x, y, 8.6, barHeight);
    }

    return frame.toBuffer("image/png");
};

function roundRect(
    ctx: any,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number | { tl: number; tr: number; br: number; bl: number },
    fill: boolean,
    stroke: boolean = true
): void {
    if (typeof radius === "undefined") radius = 10;
    if (typeof radius === "number") {
        radius = { tl: radius, tr: radius, br: radius, bl: radius };
    } else {
        const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 };
        radius = { ...defaultRadius, ...radius };
    }

    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
}

export { AaruCard };