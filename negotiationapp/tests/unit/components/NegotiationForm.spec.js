import { createLocalVue, createWrapper, mount } from '@vue/test-utils';
import { BootstrapVue } from 'bootstrap-vue'
import NegotiationForm from '@/components/NegotiationForm.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);

//mock axios weather call
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: {
            main: {
                temp: 24
            }
        }
    })
}));

describe('NegotiationForm.test.js', () => {
    let wrapper, tabsForm, tabs, modal;
    beforeEach(() => {
        wrapper = mount(NegotiationForm, { localVue });
        tabsForm = wrapper.find('div.tabs-form');
        tabs = wrapper.findAll(".tab-item");
        modal = wrapper.find('#result-modal');
    });
    afterEach(() => {
        wrapper.destroy();
    });
    it('should render tabs correctly', () => {
        expect(tabsForm.exists()).toBe(true);
    })
    it('should render 2 tabs', () => {
        expect(tabs.length).toBe(2);
    })
    it('should not submit if amount <0', () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(-1);
        form.trigger('submit');
        expect(wrapper.vm.submitedEmployerForm).toBe(false);
    })
    it('should submit if amount >0', () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(50);
        form.trigger('submit');
        expect(wrapper.vm.submitedEmployerForm).toBe(true);
    })
    it('input should disapear after submited', async () => {
        let input = tabs.at(0).find("input");
        expect(input.exists()).toBe(true);
        let form = tabs.at(0).find("form");
        input.setValue(50);
        await form.trigger('submit');
        let inputRemoved = tabs.at(0).find("input");
        expect(inputRemoved.exists()).toBe(false);
    })
    it('success label should appear after submited', async () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(50);
        await form.trigger('submit');
        let sucessLabel = tabs.at(0).find(".success-label");
        expect(sucessLabel.exists()).toBe(true);
    })
    it('modal should not be visible at start', async () => {
        expect(modal.exists()).toBe(false);
    })
    it('modal should be visible when the two tabs are submited', async () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(50);
        await form.trigger('submit');
        let input2 = tabs.at(1).find("input");
        let form2 = tabs.at(1).find("form");
        input2.setValue(40);
        await form2.trigger('submit');
        const modalElement = document.getElementById('result-modal');
        expect(modalElement).toBeDefined();
        const modalElementWrapper = createWrapper(modalElement);
        expect(modalElementWrapper.exists()).toBe(true);
    })
    it('modal should display failure if negotiation is not ok', async () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(40);
        await form.trigger('submit');
        let input2 = tabs.at(1).find("input");
        let form2 = tabs.at(1).find("form");
        input2.setValue(50);
        await form2.trigger('submit');
        let modalElement2 = document.getElementById('result-modal');
        let modalElementWrapper2 = createWrapper(modalElement2);
        let resultText2 = modalElementWrapper2.find('h1');
        expect(resultText2.text()).toBe('Failure');
    })
    it('modal should say success if negotiation is ok', async () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(50);
        await form.trigger('submit');
        let input2 = tabs.at(1).find("input");
        let form2 = tabs.at(1).find("form");
        input2.setValue(40);
        await form2.trigger('submit');
        const modalElement = document.getElementById('result-modal');
        const modalElementWrapper = createWrapper(modalElement);
        let resultText = modalElementWrapper.find('h1');
        expect(resultText.text()).toBe('Success!');
    })
    it('modal should show the current temp in london', async () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(50);
        await form.trigger('submit');
        let input2 = tabs.at(1).find("input");
        let form2 = tabs.at(1).find("form");
        input2.setValue(40);
        await form2.trigger('submit');
        const modalElement = document.getElementById('result-modal');
        const modalElementWrapper = createWrapper(modalElement);
        let resultText = modalElementWrapper.find('.current-temp').find('span');
        expect(resultText.text()).toBe('The current temperature in London is 24℃');
    })
    it('on reset app the forms are not submited anymore', async () => {
        let input = tabs.at(0).find("input");
        let form = tabs.at(0).find("form");
        input.setValue(50);
        await form.trigger('submit');
        let input2 = tabs.at(1).find("input");
        let form2 = tabs.at(1).find("form");
        input2.setValue(40);
        await form2.trigger('submit');
        let resetButton = wrapper.find('button:first-of-type');
        await resetButton.trigger('click');
        expect(wrapper.vm.submitedEmployerForm).toBe(false);
        expect(wrapper.vm.submitedEmployeeForm).toBe(false);
    })
})