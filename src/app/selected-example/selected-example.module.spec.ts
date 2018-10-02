import { SelectedExampleModule } from './selected-example.module';

describe('SelectedExampleModule', () => {
  let selectedExampleModule: SelectedExampleModule;

  beforeEach(() => {
    selectedExampleModule = new SelectedExampleModule();
  });

  it('should create an instance', () => {
    expect(selectedExampleModule).toBeTruthy();
  });
});
