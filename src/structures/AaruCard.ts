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

    const bgImg = await loadImage(
        await cropImage({
            imagePath: options.background,
            width: 1700,
            height: 560,
            cropCenter: true,
            // borderRadius: 40
        })
    );

    const thumb = await loadImage(
        await cropImage({
            imagePath: options.thumbnail,
            width: 560,
            height: 560,
            cropCenter: true,
            borderRadius: 20
        })
    );

    ctx.globalAlpha = 0.7;
    ctx.filter = "blur(20px)";
    ctx.drawImage(bgImg, 0, 0, 1700, 560);
    ctx.globalAlpha = 1;
    ctx.filter = "none";

    ctx.drawImage(thumb, 45, 40, 480, 480);
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.beginPath();
    ctx.moveTo(587, 40);
    ctx.arcTo(1667, 40, 1667, 520, 20);
    ctx.arcTo(1667, 520, 567, 520, 20);
    ctx.arcTo(567, 520, 567, 40, 20);
    ctx.arcTo(567, 40, 1667, 40, 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 70px 'Righteous'";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(options.title, 622, 80);

    ctx.fillStyle = "#A79D9D";
    ctx.font = "50px 'Righteous'";
    ctx.fillText(options.author, 622, 190);

    if (options.requestor) {
        ctx.font = "40px 'Righteous'";
        ctx.fillText(`Requestor: ${options.requestor}`, 622, 400);
    }

    ctx.fillStyle = "white";
    ctx.font = "bold 70px 'Righteous'";
    ctx.textAlign = "right";
    ctx.textBaseline = "top";
    ctx.fillText(options.text, 1580, 80);

    ctx.font = "40px 'Righteous'";
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    ctx.fillText(`Duration: ${options.duration}`, 1540, 440);

    ctx.fillStyle = "red";
    for (let i = 0; i < 30; i++) {
        const barHeight = Math.random() * 80;
        const x = 1620 - (30 - i) * (8.7 + 5) - 40;
        const y = 220 + (80 - barHeight) / 2;
        ctx.fillRect(x, y, 8.6, barHeight);
    }

    return frame.toBuffer("image/png");
};

export { AaruCard };
