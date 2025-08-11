import { IsIn, IsNotEmpty } from 'class-validator';
export class AssignRoleDto {
	@IsNotEmpty() userId: string;
	@IsIn(['admin', 'editor', 'viewer']) role: string;
}
