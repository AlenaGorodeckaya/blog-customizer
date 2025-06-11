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
	currentArticleState: ArticleStateType;
	setArticleState: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
	currentArticleState,
	setArticleState,
}: ArticleParamsFormProps) => {
	// Состояние открытия/закрытия сайдбара
	const [isFormOpen, setIsFormOpen] = useState(false);
	// Локальное состояние формы (синхронизируется с currentArticleState при открытии)
	const [formSettings, setFormSettings] =
		useState<ArticleStateType>(currentArticleState);
	// Реф для сайдбара (для обработки клика вне формы)
	const formSidebarRef = useRef<HTMLDivElement>(null);

	// Обработчик кликов вне формы
	useOutsideClickClose({
		isOpen: isFormOpen,
		rootRef: formSidebarRef,
		onChange: setIsFormOpen,
		onClose: () => setIsFormOpen(false),
	});

	// Обработчик переключения состояния формы (открыть/закрыть)
	const toggleFormVisibility = useCallback(() => {
		setIsFormOpen(!isFormOpen);
		if (!isFormOpen) {
			setFormSettings(currentArticleState);
		}
	}, [isFormOpen, currentArticleState]);

	// Обработчик изменений
	/* Реализует: "При изменении настроек в сайдбаре они не применяются сразу."
  Изменения сохраняются только во временном состоянии формы"*/
	const handleSettingChange = useCallback(
		(field: keyof ArticleStateType) => (option: OptionType) => {
			setFormSettings((prev) => ({
				...prev,
				[field]: option,
			}));
		},
		[]
	);

	// Обработчик сброса настроек
	/* Реализует: При нажатии «сбросить» настройки в форме сбрасываются на начальные,
  которые были при открытии страницы, и стили применяются к статье.*/
	const resetSettings = useCallback(() => {
		setFormSettings(defaultArticleState);
		setArticleState(defaultArticleState);
		setIsFormOpen(false);
	}, [setArticleState]);

	// Обработчик применения изменений
	// Реализует: "После нажатия на «применить» стили применяются к статье"
	const applySettings = useCallback(
		(e: React.FormEvent) => {
			e.preventDefault();
			setArticleState(formSettings);
			setIsFormOpen(false);
		},
		[formSettings, setArticleState]
	);

	return (
		<>
			<ArrowButton isOpen={isFormOpen} onClick={toggleFormVisibility} />

			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}
				ref={formSidebarRef}>
				<form
					className={styles.form}
					onSubmit={applySettings}
					onReset={resetSettings}>
					<Text size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'
						selected={formSettings.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={handleSettingChange('fontFamilyOption')}
					/>
					<RadioGroup
						title='Размер шрифта'
						name='fontSize'
						options={fontSizeOptions}
						selected={formSettings.fontSizeOption}
						onChange={handleSettingChange('fontSizeOption')}
					/>
					<Select
						title='Цвет текста'
						selected={formSettings.fontColor}
						options={fontColors}
						onChange={handleSettingChange('fontColor')}
					/>
					<Separator />
					<Select
						title='Цвет фона'
						selected={formSettings.backgroundColor}
						options={backgroundColors}
						onChange={handleSettingChange('backgroundColor')}
					/>
					<Select
						title='Ширина контента'
						selected={formSettings.contentWidth}
						options={contentWidthArr}
						onChange={handleSettingChange('contentWidth')}
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
