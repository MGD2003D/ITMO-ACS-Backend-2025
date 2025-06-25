import { IsEmail, IsString, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class UserResponseDto {
    id!: number;
    username!: string;
    email!: string;
    bio?: string;
    avatarUrl?: string;
    createdAt!: Date;
}

export class UserCreateDto {
    @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
    @IsString()
    username!: string;

    @IsEmail({}, { message: 'Некорректный формат email' })
    email!: string;

    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password!: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}

export class UserUpdateDto {
    @IsOptional()
    @IsNotEmpty({ message: 'Имя пользователя не может быть пустым' })
    @IsString()
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Некорректный формат email' })
    email?: string;

    @IsOptional()
    @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
    password?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;
}