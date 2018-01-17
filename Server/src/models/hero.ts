import { Document, Model, model} from 'mongoose';
import { IHero } from '../interfaces/hero';
import { heroSchema } from '../schemas/hero';

export interface HeroModel extends IHero, Document { }

export interface HeroModelStatic extends Model<HeroModel> {}

export const Hero = model<HeroModel, HeroModelStatic>("Hero", heroSchema);