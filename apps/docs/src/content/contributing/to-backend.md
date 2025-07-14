# Contributing to the Backend

To maintain a **scalable, maintainable, and efficient** backend codebase using
**NestJS**, follow this guideline when developing new features or making
improvements.

---

## 🏗️ **Before Development**

### 🔍 Understand the Requirement

Before writing any code, ensure you fully understand the feature's
requirements:  
✔️ Clarify any doubts with the team.  
✔️ Analyze if the feature fits within the existing structure or requires
adjustments.  
✔️ Consider potential edge cases, security implications, and dependencies.  
✔️ Outline an implementation plan to ensure smooth development and avoid
redundant work.

📌 **Example:**  
If implementing a new authentication mechanism, check if there are existing
authentication strategies in the system to avoid duplication.

---

### 🏡 Evaluate Scope & Architecture

If the feature involves multiple services or modules:  
✔️ Ensure **separation of concerns** and promote **reusability**.  
✔️ Follow the **modular structure** in NestJS by placing related functionalities
within a dedicated module.  
✔️ If the feature requires **shared DTOs** or **types**, place them inside the
[**shared package**](../packages/shared.md).

📌 **Example:**  
For a **payment processing system**, create a dedicated module:

```
/src
  ├── modules
  │    ├── payment/
  │    │    ├── payment.module.ts
  │    │    ├── payment.controller.ts
  │    │    ├── payment.service.ts
  │    │    ├── payment.entity.ts
  │    │    ├── payment.dto.ts
  │    │    ├── payment.repository.ts
```

---

### 📦 Install Dependencies (If Needed)

If a new library is required:  
✔️ Use **Yarn** to install it.  
✔️ Ensure it does not duplicate existing functionality.  
✔️ Confirm that it follows best practices and security standards.

📌 **Example:**  
Adding **class-validator** for validation:

```sh
yarn workspace @denali/api class-validator class-transformer
# Or to add as a dev dependency
yarn workspace @denali/api add -D @jest/types
```

---

## 🛠️ **During Development**

### 🏷️ Define & Manage DTOs

✔️ Ensure DTOs **strictly define** the API response structure to avoid
unnecessary data exposure.  
✔️ Use **class-validator** for validation and transformation.  
✔️ If shared with frontend place **DTOs** in the
[**shared package**](../packages/shared.md) for reusability.

📌 **Example Shared Response DTO:**

```ts
// user.dto.ts
import { IsString, IsEmail, IsUUID } from 'class-validator';

export class UserResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

---

### 🔄 Service Layer & Business Logic

✔️ Keep **controllers lightweight**—move business logic to services.  
✔️ **Services should be responsible for data processing**, while controllers
handle request validation and responses.  
✔️ Use **repositories** for database access instead of directly querying the
database in services.

📌 **Example:**

```ts
// modules/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserResponseDto } from '@denalt/shared/response/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    return new UserResponseDto(user);
  }
}
```

---

### 🌐 API Routes & Controllers

✔️ Follow **RESTful principles** where applicable.  
✔️ Use **decorators** (`@Get()`, `@Post()`, `@Put()`, `@Delete()`) for defining
API routes.  
✔️ **Validate incoming requests** with DTOs and `class-validator`.  
✔️ **Document endpoints** with Swagger decorators for better API visibility.

📌 **Example Controller with Swagger Documentation:**

```ts
// modules/user/user.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from '@denali/shared/response/user.dto';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUserById(id);
  }
}
```

---

### 🛡️ Error Handling & Logging

✔️ Use NestJS **Exception Filters** for consistent error handling.  
✔️ Implement **custom exceptions** for domain-specific errors.  
✔️ Log errors with **Pino** or another logging library.

📌 **Example Custom Exception:**

```ts
// common/exceptions/user-not-found.exception.ts
import { NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor() {
    super('User not found');
  }
}
```

📌 **Example Logging Setup:**

```ts
import { Logger } from '@nestjs/common';

const logger = new Logger('UserService');

logger.error('User not found', { userId });
```

---

## ✅ Testing

### 🧪 Unit Tests

✔️ Write **unit tests** for services and controllers using **Jest**.  
✔️ Use **mocks and spies** to avoid direct database calls.

📌 **Example Unit Test:**

```ts
// test/user.service.unit.spec.ts
import { UserService } from '../modules/user/user.service';
import { UserRepository } from '../modules/user/user.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should return user by ID', async () => {
    jest.spyOn(repository, 'findById').mockResolvedValue({
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
    });
    const result = await service.getUserById('123');
    expect(result.name).toBe('John Doe');
  });
});
```

---

By following this guide, we ensure a **structured, scalable, and maintainable**
backend codebase.

🚀 **Happy Coding!** 🎨💻
