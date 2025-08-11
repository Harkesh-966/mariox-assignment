import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AssignRoleUseCase } from '@/application/users/use-cases/assign-role.usecase';
import { ListUsersUseCase } from '@/application/users/use-cases/list-users.usecase';
import { Roles } from '../../common/guards/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AssignRoleDto } from './dtos/assign-role.dto';

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
	constructor(
		private readonly assignRole: AssignRoleUseCase,
		private readonly listUsers: ListUsersUseCase,
	) { }

	@Get()
	@Roles('admin')
	async list() { return this.listUsers.execute(); }

	@Post('assign-role')
	@Roles('admin')
	async assign(@Body() dto: AssignRoleDto) { return this.assignRole.execute(dto); }
}
