// import { Controller } from '@nestjs/common';
// import { Crud, CrudController } from '@datafas/crud';
// import { RiskRulesService } from './risk-rule.service';
// import { RiskRule } from '@/risk-radar/entities';

// @Crud({
//   model: {
//     type: RiskRule,
//   },
//   routes: {
//     only: ['getOneBase', 'getManyBase'],
//   },

//   query: {
//     alwaysPaginate: true,
//     join: {},
//   },
// })
// @Controller({
//   version: '1',
//   path: 'risk-rule',
// })
// export class RiskRulesController implements CrudController<RiskRule> {
//   constructor(public service: RiskRulesService) {}
// }
