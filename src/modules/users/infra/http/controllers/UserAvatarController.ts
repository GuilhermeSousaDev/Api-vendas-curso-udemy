import { instanceToInstance } from "class-transformer";
import { Request, Response } from "express";
import { container } from "tsyringe";
import UpdateUserAvatarService from "../../../services/UpdateUserAvatarService";

export default class UserAvatarController {
    public async update(req: Request, res: Response): Promise<Response> {
        const updateAvatar = container.resolve(UpdateUserAvatarService);

        const user = await updateAvatar.execute({
            user_id: req.user.id,
            avatarFilename: req.file.originalName
        });

        return res.json(instanceToInstance(user));
    }
}
