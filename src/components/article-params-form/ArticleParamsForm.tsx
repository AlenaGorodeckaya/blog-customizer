import { useState, useRef, useCallback } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import clsx from 'clsx';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
	OptionType,
} from 'src/constants/articleProps';
import { useOutsideClickClose } from 'src/ui/select/hooks/useOutsideClickClose';
import styles from 'src/components/article-params-form/ArticleParamsForm.module.scss';

import { Text } from 'src/ui/text';
import { Separator } from 'src/ui/separator';

type ArticleParamsFormProps = {
	// Текущее состояние страницы
	currentState: ArticleStateType;
	setAppState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentState,
	setAppState,
}: ArticleParamsFormProps) => {
	// Состояние открытия/закрытия сайдбара
	const [isOpen, setIsOpen] = useState(false);
	// Локальное состояние формы (синхронизируется с currentState при открытии)
	const [formState, setFormState] = useState<ArticleStateType>(currentState);
	// Реф для сайдбара (для обработки клика вне формы)
	const rootRef = useRef<HTMLDivElement>(null);

	/* Реализует: "При нажатии на «стрелку» открывается сайдбар с настройками,
  при повторном нажатии или клике вне сайдбар закрывается."*/
	useOutsideClickClose({
		isOpen,
		rootRef,
		onChange: setIsOpen, // Закрытие при клике вне формы
	});

	// Обработчик переключения состояния формы (открыть/закрыть)
	const handleToggleForm = useCallback(() => {
		setIsOpen(!isOpen);
		if (!isOpen) {
			setFormState(currentState);
		}
	}, [isOpen, currentState]);

	// Обработчик изменений
	/* Реализует: "При изменении настроек в сайдбаре они не применяются сразу."
  Изменения сохраняются только во временном состоянии формы"*/
	const handleChange = useCallback(
		(field: keyof ArticleStateType) => (option: OptionType) => {
			setFormState((prev) => ({
				...prev,
				[field]: option,
			}));
		},
		[]
	);

	// Обработчик сброса настроек
	/* Реализует: При нажатии «сбросить» настройки в форме сбрасываются на начальные,
  которые были при открытии страницы, и стили применяются к статье.*/
	const handleReset = useCallback(() => {
		setFormState(defaultArticleState);
		setAppState(defaultArticleState);
		setIsOpen(false);
	}, [setAppState]);

	// Обработчик применения изменений
	// Реализует: "После нажатия на «применить» стили применяются к статье"
	const handleApply = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			setAppState(formState);
			setIsOpen(false);
		},
		[formState, setAppState]
	);

	return (
		<>
			<ArrowButton isOpen={isOpen} onClick={handleToggleForm} />

			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}
				ref={rootRef}>
				<form
					className={styles.form}
					onSubmit={handleApply}
					onReset={handleReset}>
					<Text size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleChange('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={handleChange('fontSizeOption')}
					/>
					<Select
						title='Цвет текста'
						selected={formState.fontColor}
						options={fontColors}
						onChange={handleChange('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={handleChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={handleChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' type='clear' htmlType='reset' />
						<Button title='Применить' type='apply' htmlType='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
