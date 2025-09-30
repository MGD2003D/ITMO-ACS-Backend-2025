import {
    Body,
    Controller,
    Delete,
    Get,
    NoSecurity,
    Path,
    Post,
    Put,
    Query,
    Request,
    Route,
    Security,
    SuccessResponse,
    Tags,
} from "tsoa";
import { AppDataSource } from "../data-source";
import { User } from "../models";
import { UserCreateDto, UserResponseDto, UserUpdateDto } from "../dtos/user.dto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class LoginDto {
    email!: string;
    password!: string;
}

@Route("users")
@Tags("Users")
@Security("jwt")
export class UsersController extends Controller {
    private userRepo = AppDataSource.getRepository(User);

    private toUserResponseDto(user: User): UserResponseDto {
        const { password, ...rest } = user;
        return rest;
    }

    @SuccessResponse("201", "Created")
    @Post()
    @NoSecurity()
    public async createUser(@Body() requestBody: UserCreateDto): Promise<UserResponseDto> {
        const hashedPassword = await bcrypt.hash(requestBody.password, 10);
        const user = this.userRepo.create({
            ...requestBody,
            password: hashedPassword,
        });
        const savedUser = await this.userRepo.save(user);

        this.setStatus(201);
        return this.toUserResponseDto(savedUser);
    }

    @Get()
    @NoSecurity()
    public async getAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.userRepo.find();
        return users.map(user => this.toUserResponseDto(user));
    }

    @Get("/{userId}")
    @NoSecurity()
    public async getUserById(@Path() userId: number): Promise<UserResponseDto> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            this.setStatus(404);
            throw new Error("User not found");
        }
        return this.toUserResponseDto(user);
    }

    @Put("/{userId}")
    public async updateUser(@Path() userId: number, @Body() requestBody: UserUpdateDto, @Request() request: any): Promise<UserResponseDto> {
        const userToUpdate = await this.userRepo.findOneBy({ id: userId });

        if (request.user.id !== userId) {
            this.setStatus(403);
            throw new Error("You are not authorized to update this profile");
        }
        if (!userToUpdate) {
            this.setStatus(404);
            throw new Error("User not found");
        }
        if (requestBody.password) {
            requestBody.password = await bcrypt.hash(requestBody.password, 10);
        }
        Object.assign(userToUpdate, requestBody);
        const updatedUser = await this.userRepo.save(userToUpdate);
        return this.toUserResponseDto(updatedUser);
    }

    @Delete("/{userId}")
    public async deleteUser(@Path() userId: number, @Request() request: any): Promise<{ success: boolean }> {

        if (request.user.id !== userId) {
            this.setStatus(403);
            throw new Error("You are not authorized to update this profile");
        }
        
        const result = await this.userRepo.delete(userId);

        if (!result.affected) {
            this.setStatus(404);
            throw new Error("User not found");
        }

        return { success: true };
    }

    @Post("/login")
    @NoSecurity()
    public async loginUser(@Body() requestBody: LoginDto): Promise<{ token: string }> {
        if (!process.env.JWT_SECRET) {
            this.setStatus(500);
            throw new Error("FATAL ERROR: JWT_SECRET is not defined in .env file");
        }
        const { email, password } = requestBody;
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            this.setStatus(401);
            throw new Error("Invalid credentials");
        }
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
        return { token };
    }

    @Get("/search/by")
    @NoSecurity()
    public async searchUser(@Query() id?: number, @Query() email?: string): Promise<UserResponseDto> {
        if (!id && !email) {
            this.setStatus(400);
            throw new Error("id or email query param required");
        }
        let user: User | null = null;
        if (id) {
            user = await this.userRepo.findOneBy({ id: Number(id) });
        } else if (email) {
            user = await this.userRepo.findOneBy({ email });
        }
        if (!user) {
            this.setStatus(404);
            throw new Error("Not found");
        }
        return this.toUserResponseDto(user);
    }
}